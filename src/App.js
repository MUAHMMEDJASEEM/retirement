import { useState } from "react";

const RetirementCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [years, setYears] = useState(30);
  const [inflationRate, setInflationRate] = useState(7);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [returnRate, setReturnRate] = useState(11);
  const [stepUpRate, setStepUpRate] = useState(7);
  const [existingCorpus, setExistingCorpus] = useState(0);
  const [result, setResult] = useState(null);

  const adjustForInflation = (value, years, rate) => value * (1 + rate / 100) ** years;
  const calculateRetirementCorpus = (monthly, rate) => (monthly * 12) / (rate / 100);

  // Future value of existing corpus at return rate
  const futureValueOfExistingCorpus = (corpus, years, returnRate) => corpus * (1 + returnRate / 100) ** years;

  const futureValueWithStepUp = (initial, years, returnRate, stepUpRate) => {
    let total = 0;
    let annualInvestment = initial;
    for (let year = 0; year < years; year++) {
      total += annualInvestment * (1 + returnRate / 100) ** (years - year);
      annualInvestment *= 1 + stepUpRate / 100;
    }
    return total;
  };

  const findInitialInvestment = (target, years, returnRate, stepUpRate) => {
    let low = 1,
      high = 1e7,
      tolerance = 1e3;
    while (high - low > tolerance) {
      let mid = (low + high) / 2;
      if (futureValueWithStepUp(mid, years, returnRate, stepUpRate) < target) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return (low + high) / 2;
  };

  const calculateRetirementPlan = () => {
    const futureMonthlyIncome = adjustForInflation(monthlyIncome, years, inflationRate);
    const retirementCorpus = calculateRetirementCorpus(futureMonthlyIncome, withdrawalRate);

    // Calculate how much the existing corpus will grow in `years`
    const futureCorpusValue = futureValueOfExistingCorpus(existingCorpus, years, returnRate);

    // Remaining corpus needed after accounting for future growth of existing corpus
    const remainingCorpus = Math.max(retirementCorpus - futureCorpusValue, 0);

    // Find required annual investment
    const initialInvestment = findInitialInvestment(remainingCorpus, years, returnRate, stepUpRate);

    setResult({
      futureMonthlyIncome,
      retirementCorpus,
      existingCorpus,
      futureCorpusValue,
      remainingCorpus,
      initialInvestment,
    });
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Retirement Calculator</h2>

        <label>Desired Monthly Income (₹)</label>
        <input
          type="range"
          min="1000"
          max="2000000"
          step="1000"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(Number(e.target.value))}
        />
        <span>{monthlyIncome}</span>

        <label>Years Until Retirement</label>
        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />
        <span>{years}</span>

        <label>Inflation Rate (%)</label>
        <input
          type="range"
          min="0"
          max="15"
          step="0.1"
          value={inflationRate}
          onChange={(e) => setInflationRate(Number(e.target.value))}
        />
        <span>{inflationRate}%</span>

        <label>Withdrawal Rate (%)</label>
        <input
          type="range"
          min="1"
          max="10"
          step="0.1"
          value={withdrawalRate}
          onChange={(e) => setWithdrawalRate(Number(e.target.value))}
        />
        <span>{withdrawalRate}%</span>

        <label>Return Rate (%)</label>
        <input
          type="range"
          min="1"
          max="30"
          step="0.1"
          value={returnRate}
          onChange={(e) => setReturnRate(Number(e.target.value))}
        />
        <span>{returnRate}%</span>

        <label>Step-up Rate (%)</label>
        <input
          type="range"
          min="0"
          max="15"
          step="0.1"
          value={stepUpRate}
          onChange={(e) => setStepUpRate(Number(e.target.value))}
        />
        <span>{stepUpRate}%</span>

        <label>Existing Retirement Corpus (₹)</label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="range"
            min="0"
            max="50000000"
            step="10000"
            value={existingCorpus}
            onChange={(e) => setExistingCorpus(Number(e.target.value))}
            style={{ flex: "1" }}
          />

        </div>
        <span>₹{existingCorpus.toLocaleString()}</span>


        <button onClick={calculateRetirementPlan}>Calculate</button>
      </div>

      {result && (
        <div className="card">
          <h3>Retirement Plan Summary</h3>
          <p>Future Monthly Income Needed: ₹{result.futureMonthlyIncome.toFixed(0)}/month</p>
          <p>Required Retirement Corpus: ₹{result.retirementCorpus.toFixed(0)}</p>
          <p>Existing Corpus: ₹{result.existingCorpus.toFixed(0)}</p>
          <p>Future Value of Existing Corpus: ₹{result.futureCorpusValue.toFixed(0)}</p>
          <p>Remaining Corpus to be Accumulated: ₹{result.remainingCorpus.toFixed(0)}</p>
          <p>Starting Annual Investment: ₹{result.initialInvestment.toFixed(0)}</p>
          <p><b>Disclaimer</b>: The calculations provided are estimates based on the inputs given. Actual investment returns, inflation rates, and financial conditions may vary. This tool is for informational purposes only and does not constitute financial advice. Please consult a financial advisor before making investment decisions.</p>
        </div>
      )}
    </div>
  );
};

export default RetirementCalculator;
