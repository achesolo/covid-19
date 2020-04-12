// const fs = require('fs');

// const readData = fs.readFileSync('./src/inputData.json', 'utf8');
// const Jsondata = JSON.parse(readData);
const returnPeriod = (ImpactData) => {
  // ImpactData = Jsondata;
  if (ImpactData.periodType === 'days') {
    return Math.trunc((ImpactData.timeToElapse * 1) / 3);
  }
  if (ImpactData.periodType === 'weeks') {
    return Math.trunc((ImpactData.timeToElapse * 7) / 3);
  }
  if (ImpactData.periodType === 'months') {
    return Math.trunc((ImpactData.timeToElapse * 30) / 3);
  }
  return 0;
};

const Impact = (data) => {
//  const { timeToElapse } = data;
  const { avgDailyIncomePopulation } = data.region;
  const { avgDailyIncomeInUSD } = data.region;
  const { totalHospitalBeds } = data;

  const currentlyInfected = Math.floor(data.reportedCases * 10);
  const currentlyInfectedSevere = Math.floor(data.reportedCases * 50);

  const infectionsByRequestedTime = Math.floor(currentlyInfected * (2 ** returnPeriod(data)));
  const infectionsByRequestedTimeSevere = Math.floor(currentlyInfectedSevere
     * (2 ** returnPeriod(data)));

  const severeCasesByRequestedTime = Math.floor(0.15 * infectionsByRequestedTime);
  const severeCasesByRequestedTimeSevere = Math.floor(0.15 * infectionsByRequestedTimeSevere);

  const severeCovid19PositiveBeds = Math.floor(0.35 * totalHospitalBeds);
  const severeCovid19PositiveBedsSevere = Math.floor(0.35 * totalHospitalBeds);

  const hospitalBedsByRequestedTime = Math.floor(severeCovid19PositiveBeds
    - severeCasesByRequestedTime);
  const hospitalBedsByRequestedTimeSevere = Math.floor(severeCovid19PositiveBedsSevere
  - severeCasesByRequestedTimeSevere);

  const casesForICUByRequestedTime = Math.floor(0.05 * infectionsByRequestedTime);
  const casesForICUByRequestedTimeSevere = Math.floor(0.05 * infectionsByRequestedTimeSevere);

  const casesForVentilatorsByRequestedTime = Math.floor(0.02 * infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTimeSevere = Math.floor(0.02
    * infectionsByRequestedTimeSevere);

  const dollarsInFlight = Math.floor(infectionsByRequestedTime * avgDailyIncomePopulation
   * avgDailyIncomeInUSD * returnPeriod(data));
  const dollarsInFlightICUSevere = Math.floor(infectionsByRequestedTimeSevere
   * avgDailyIncomePopulation * avgDailyIncomeInUSD * returnPeriod(data));


  return {
    estimate: {
      impact: {
        // ch-1
        currentlyInfected,
        infectionsByRequestedTime,
        // ch-2
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        // ch-3
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
      },
      severeImpact: {
        currentlyInfected: currentlyInfectedSevere,
        infectionsByRequestedTime: infectionsByRequestedTimeSevere,
        severeCasesByRequestedTime: severeCasesByRequestedTimeSevere,
        hospitalBedsByRequestedTime: hospitalBedsByRequestedTimeSevere,
        casesForICUByRequestedTime: casesForICUByRequestedTimeSevere,
        casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTimeSevere,
        dollarsInFlight: dollarsInFlightICUSevere
      }
    }
  };
};


const covid19ImpactEstimator = (data) => {
  const im = Impact(data);
  const { estimate } = im;
  const { impact } = estimate;
  const { severeImpact } = estimate;


  return {
    data,
    impact,
    severeImpact
  };
};

module.exports = covid19ImpactEstimator;
//
