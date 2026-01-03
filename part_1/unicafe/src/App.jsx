import { useState } from "react";





const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const StatisticLine = ({ text, value }) => {
  return (
    <div>
      {text} {value}
    </div>
  );
};

const Statistics = ({ options }) => {
  if (!(options.good || options.neutral || options.bad)) {
    return <div>No feedback given</div>;
  }

  const totalVal = options.good + options.neutral + options.bad;
  const avgVal = (options.good - options.bad) / totalVal;
  const positiveVal = (options.good / totalVal) * 100;

  return (
    <div>
      <StatisticLine text="good" value={options.good} />
      <StatisticLine text="neutral" value={options.neutral} />
      <StatisticLine text="bad" value={options.bad} />
      <StatisticLine text="total" value={totalVal} />
      <StatisticLine text="avg" value={avgVal} />
      <StatisticLine text="positive" value={positiveVal} />
    </div>
  );

  // const counts = [];
  // for (const [key, value] of Object.entries(options)) {
  //   counts.push(
  //     <div key={key}>
  //       {key} {value}
  //     </div>
  //   );
  // }
  // const totalVal = options.good + options.neutral + options.bad;
  // const total = <div>total {totalVal}</div>;
  // const avg = <div>average {(options.good - options.bad) / totalVal}</div>;
  // const positive = <div>positive {(options.good / totalVal) * 100}</div>;

  // return (
  //   <div>
  //     {counts}
  //     {total}
  //     {avg}
  //     {positive}
  //   </div>
  // );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [bad, setBad] = useState(0);
  const [neutral, setNeutral] = useState(0);

  const options = { good, neutral, bad };

  return (
    <div>
      <Header text="give feedback" />
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />

      <Header text="statistics" />
      <Statistics options={options} />
    </div>
  );
};

export default App;
