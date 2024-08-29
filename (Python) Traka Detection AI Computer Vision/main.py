import cv2
import numpy as np
from cvlib.object_detection import draw_bbox
from vidgear.gears import CamGear
import os
import time
import requests

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Load MobileNet SSD model
prototxt = 'deploy.prototxt'  
model = 'mobilenet_iter_73000.caffemodel'  

net = cv2.dnn.readNetFromCaffe(prototxt, model)

# List of COCO labels corresponding to MobileNet SSD indices
COCO_LABELS = [
    "background", "unlabeled", "bicycle", "bird", "boat",
    "bottle", "bus", "car", "cat", "chair",
    "unlabeled", "unlabeled", "unlabeled", "unlabeled", "unlabeled",
    "person", "sheep", "sofa", "train", "tvmonitor"
]

COCO_LABELS[3] = "wheelchair"

# Start video stream
stream = CamGear(source='https://youtu.be/ol5LXdu1xJw', stream_mode=True, logging=True, timeout=120).start()
count = 0

# Function to send object count to the server
def send_person_count(person_count):
    try:
        data = {'count': person_count}
        response = requests.post('http://localhost:8080/get-person-count', json=data)
        if response.status_code == 200:
            print("Person count sent successfully to server")
        else:
            print("Failed to send person count to server")
    except Exception as e:
        print(f"Error sending person count to server: {str(e)}")


while True:
    frame = stream.read()
    count += 1
    if count % 6 != 0:
        continue

    frame = cv2.resize(frame, (1020, 600))
    (h, w) = frame.shape[:2]

    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 0.007843, (300, 300), 127.5)
    net.setInput(blob)
    detections = net.forward()

    bbox = []
    label = []
    conf = []

    person_count = 0  # Variable to store the person count

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.2:
            idx = int(detections[0, 0, i, 1])
            if idx < len(COCO_LABELS) and COCO_LABELS[idx] != 'unlabeled':
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                bbox.append([startX, startY, endX, endY])
                label.append(COCO_LABELS[idx])
                conf.append(float(confidence))

                # Increment the person count if a person is detected
                if COCO_LABELS[idx] == 'person':
                    person_count += 1

    frame = draw_bbox(frame, bbox, label, conf)

    text = f"Total Persons: {person_count}"  # Change "Total Objects" to "Total Persons"
    
    cv2.putText(frame, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("FRAME", frame)
    key = cv2.waitKey(1) & 0xFF  # Wait for a key press for 1 millisecond
    if key == 27:  # Check if the ESC key is pressed
        break

    # Send person count to the server every 2 seconds
    if count % 12 == 0:  # Change 12 to 120 for 2 seconds delay (since count increments every 6 frames)
        send_person_count(person_count)

stream.release()
cv2.destroyAllWindows()
