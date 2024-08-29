var options1 = {
  chart: {
    height: 350,
    type: "radialBar",
  },
  series: [45],
  labels: ["Scheduled"],
  fill: {
    colors: ["#E69C57"],
  },

  dataLabels: {
    style: {
      colors: ["#E69C57", "#E91E63", "#9C27B0"],
    },
  },
};

var options2 = {
  chart: {
    height: 350,
    type: "radialBar",
  },
  series: [38],
  labels: ["On-time"],
  fill: {
    colors: ["#4FCB23"],
  },
};

var options3 = {
  chart: {
    height: 350,
    type: "radialBar",
  },
  series: [2],
  labels: ["Delays"],
  fill: {
    colors: ["#E66D57"],
  },
};

//ANALYTICS
options_a1 = {
  chart: {
    type: "bar",
  },

  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  responsive: [
    {
      breakpoint: 550,
      options: {},
    },
  ],
  series: [
    {
      data: [
        {
          x: "Week 1",
          y: 28,
        },
        {
          x: "Week 2",
          y: 25,
        },
        {
          x: "Week 3",
          y: 23,
        },
        {
          x: "Week 4",
          y: 18,
        },
      ],
    },
  ],
};

options_a2 = {
  chart: {
    type: "bar",
  },

  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  responsive: [
    {
      breakpoint: 550,
      options: {},
    },
  ],
  series: [
    {
      data: [
        {
          x: "January",
          y: 94,
        },
        {
          x: "February",
          y: 87,
        },
        {
          x: "March",
          y: 123,
        },
        {
          x: "April",
          y: 112,
        },
        {
          x: "May",
          y: 56,
        },
        {
          x: "June",
          y: 0,
        },
        {
          x: "July",
          y: 0,
        },
        {
          x: "August",
          y: 0,
        },
        {
          x: "September",
          y: 0,
        },
        {
          x: "October",
          y: 0,
        },
        {
          x: "November",
          y: 0,
        },
        {
          x: "December",
          y: 0,
        },
      ],
    },
  ],
};

options_a3 = {
  chart: {
    type: "bar",
  },

  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  responsive: [
    {
      breakpoint: 550,
      options: {},
    },
  ],
  series: [
    {
      data: [
        {
          x: "2021",
          y: 984,
        },
        {
          x: "2022",
          y: 1123,
        },
        {
          x: "2023",
          y: 1202,
        },
        {
          x: "2024",
          y: 472,
        },
      ],
    },
  ],
};

var chart1 = new ApexCharts(document.querySelector("#chart1"), options1);
var chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
var chart3 = new ApexCharts(document.querySelector("#chart3"), options3);
var chart_a1 = new ApexCharts(document.querySelector("#chart_a1"), options_a1);
var chart_a2 = new ApexCharts(document.querySelector("#chart_a2"), options_a2);
var chart_a3 = new ApexCharts(document.querySelector("#chart_a3"), options_a3);

chart1.render();
chart2.render();
chart3.render();

chart_a1.render();
chart_a2.render();
chart_a3.render();
