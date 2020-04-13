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

  const currentlyInfected = Math.truc(data.reportedCases * 10);
  const currentlyInfectedSevere = Math.truc(data.reportedCases * 50);

  const infectionsByRequestedTime = Math.truc(currentlyInfected * (2 ** returnPeriod(data)));
  const infectionsByRequestedTimeSevere = Math.truc(currentlyInfectedSevere
     * (2 ** returnPeriod(data)));

  const severeCasesByRequestedTime = Math.truc(0.15 * infectionsByRequestedTime);
  const severeCasesByRequestedTimeSevere = Math.truc(0.15 * infectionsByRequestedTimeSevere);

  const severeCovid19PositiveBeds = Math.truc(0.35 * totalHospitalBeds);
  const severeCovid19PositiveBedsSevere = Math.truc(0.35 * totalHospitalBeds);

  const hospitalBedsByRequestedTime = Math.truc(severeCovid19PositiveBeds
    - severeCasesByRequestedTime) + 1;
  const hospitalBedsByRequestedTimeSevere = Math.truc(severeCovid19PositiveBedsSevere
  - severeCasesByRequestedTimeSevere) + 1;

  const casesForICUByRequestedTime = Math.truc(0.05 * infectionsByRequestedTime);
  const casesForICUByRequestedTimeSevere = Math.truc(0.05 * infectionsByRequestedTimeSevere);

  const casesForVentilatorsByRequestedTime = Math.truc(0.02 * infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTimeSevere = Math.truc(0.02
    * infectionsByRequestedTimeSevere);

  const dollarsInFlight = Math.truc(infectionsByRequestedTime * avgDailyIncomePopulation
   * avgDailyIncomeInUSD * returnPeriod(data));
  const dollarsInFlightICUSevere = Math.truc(infectionsByRequestedTimeSevere
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
