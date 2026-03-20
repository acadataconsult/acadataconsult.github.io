const WHATSAPP_NUMBER = '233265355732';

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppLinks();
  setYear();
  initTool01TestFinder();
  initTool02PValueExplainer();
  initTool03ChartChooser();
  initTool04CICalculator();
  initTool05AssumptionChecker();
  initTool06RegressionRecommender();
  initTool07DescriptiveInterpreter();
  initTool08CronbachGuide();
  initTool09SurveyChecklist();
  initTool10PowerCalculator();
  initTool11SampleSizeEstimator();
});

function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initWhatsAppLinks() {
  document.querySelectorAll('[data-wa-link]').forEach((link) => {
    const message = link.getAttribute('data-wa-link') || 'Hello Acadata Insight Consult.';
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  });
}

function showResult(box) {
  if (!box) return;
  box.classList.add('show');
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResult(box) {
  if (!box) return;
  box.classList.remove('show');
}

function safeFixed(num, digits = 3) {
  return Number(num).toFixed(digits).replace(/\.0+$|(?<=\..*?)0+$/g, '');
}

function formatPValue(p) {
  if (p < 0.001) return '< 0.001';
  return safeFixed(p, 4);
}

function bindEnterKey(inputIds, handler) {
  inputIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handler();
      }
    });
  });
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * absX);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

function normalCdf(x) {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

function getTwoSidedCriticalZ(alpha) {
  if (Math.abs(alpha - 0.10) < 1e-9) return 1.645;
  if (Math.abs(alpha - 0.05) < 1e-9) return 1.96;
  if (Math.abs(alpha - 0.01) < 1e-9) return 2.576;
  return 1.96;
}

function initTool01TestFinder() {
  const ids = ['goal', 'outcome', 'predictor', 'groups', 'paired', 'normality'];
  const box = document.getElementById('resultBox');

  const setResult = (name, reason, extra = '') => {
    setText('testName', name);
    setText('testReason', reason);
    setText('testExtra', extra);
    showResult(box);
  };

  const recommendTest = () => {
    const [g, o, p, gr, pa, n] = ids.map((id) => document.getElementById(id).value);

    if ([g, o, p, gr, pa, n].some((value) => !value)) {
      setResult(
        'Incomplete selection',
        'Please answer all six questions so the tool can recommend the most suitable test.',
        'Once all fields are selected, click “Recommend Test” again.'
      );
      return;
    }

    if (g === 'difference') {
      if (o === 'continuous' && p === 'categorical' && gr === '2' && pa === 'independent' && n === 'yes') {
        setResult('Independent Samples t-test', 'You are comparing the mean of a continuous outcome between two independent groups, and the data are approximately normal.', 'If normality is violated, consider the Mann–Whitney U test.');
        return;
      }
      if (o === 'continuous' && p === 'categorical' && gr === '2' && pa === 'independent' && n === 'no') {
        setResult('Mann–Whitney U Test', 'You are comparing two independent groups, but the numerical outcome is not normally distributed or you are unsure.', 'This is a common non-parametric alternative to the independent t-test.');
        return;
      }
      if (o === 'continuous' && p === 'categorical' && gr === '2' && pa === 'paired' && n === 'yes') {
        setResult('Paired Samples t-test', 'You are comparing two related measurements, such as before-versus-after observations, with a continuous approximately normal outcome.', 'If the paired outcome is not normal, consider the Wilcoxon signed-rank test.');
        return;
      }
      if (o === 'continuous' && p === 'categorical' && gr === '2' && pa === 'paired' && n === 'no') {
        setResult('Wilcoxon Signed-Rank Test', 'You are comparing two related measurements and the continuous outcome is not approximately normal.', 'This is the non-parametric alternative to the paired t-test.');
        return;
      }
      if (o === 'continuous' && p === 'categorical' && gr === '3plus' && pa === 'independent' && n === 'yes') {
        setResult('One-Way ANOVA', 'You are comparing the mean of a continuous outcome across three or more independent groups with approximate normality.', 'If significant, follow with a suitable post-hoc test such as Tukey’s test.');
        return;
      }
      if (o === 'continuous' && p === 'categorical' && gr === '3plus' && pa === 'independent' && n === 'no') {
        setResult('Kruskal–Wallis Test', 'You are comparing three or more independent groups, but the numerical outcome is not normally distributed.', 'If significant, use appropriate pairwise non-parametric comparisons.');
        return;
      }
      if (o === 'categorical' && p === 'categorical') {
        setResult('Chi-Square Test of Independence', 'You are assessing whether there is a difference in proportions or an association between categorical variables.', 'If expected cell counts are too small, Fisher’s exact test may be more appropriate.');
        return;
      }
    }

    if (g === 'relationship') {
      if (o === 'continuous' && p === 'continuous' && n === 'yes') {
        setResult('Pearson Correlation', 'You are examining the linear relationship between two continuous variables that are approximately normally distributed.', 'Report the correlation coefficient (r) and p-value.');
        return;
      }
      if (o === 'continuous' && p === 'continuous' && n === 'no') {
        setResult('Spearman Rank Correlation', 'You are assessing the relationship between two continuous or ordinal variables when normality is not met or the relationship may be monotonic.', 'Report rho (ρ) and p-value.');
        return;
      }
      if (o === 'categorical' && p === 'categorical') {
        setResult('Chi-Square Test of Independence', 'You are checking whether two categorical variables are associated.', 'This is commonly used for contingency table analysis.');
        return;
      }
    }

    if (g === 'prediction') {
      if (o === 'continuous') {
        setResult('Linear Regression', 'Your outcome variable is continuous, so regression can be used to predict changes in the outcome from one or more predictors.', 'Use simple linear regression for one predictor, and multiple linear regression for several predictors.');
        return;
      }
      if (o === 'categorical') {
        setResult('Logistic Regression', 'Your outcome variable is categorical, so logistic regression is generally appropriate for prediction.', 'Use binary logistic regression for two outcome categories, and multinomial logistic regression for more than two.');
        return;
      }
    }

    setResult('Further review needed', 'Your study design may need a more tailored recommendation than this basic tool can provide.', 'Examples include repeated-measures ANOVA, mixed models, survival analysis, or advanced multivariable methods.');
  };

  document.getElementById('findTestBtn').addEventListener('click', recommendTest);
  document.getElementById('resetBtn').addEventListener('click', () => {
    ids.forEach((id) => { document.getElementById(id).value = ''; });
    hideResult(box);
  });
}

function initTool02PValueExplainer() {
  const input = document.getElementById('pvalueInput');
  const box = document.getElementById('pvalueResultBox');

  const explain = () => {
    const raw = input.value.trim();

    if (raw === '') {
      setText('pvalueTitle', 'No p-value entered');
      setText('pvalueMeaning', 'Please enter a p-value between 0 and 1.');
      setText('pvalueInterpretation', 'Example values: 0.049, 0.01, 0.23.');
      setText('pvalueCaution', '');
      showResult(box);
      return;
    }

    const p = parseFloat(raw);
    if (Number.isNaN(p) || p < 0 || p > 1) {
      setText('pvalueTitle', 'Invalid p-value');
      setText('pvalueMeaning', 'A p-value must be a number from 0 to 1.');
      setText('pvalueInterpretation', 'Please enter something like 0.05 or 0.013.');
      setText('pvalueCaution', '');
      showResult(box);
      return;
    }

    if (p < 0.001) {
      setText('pvalueTitle', 'Very strong statistical evidence');
      setText('pvalueMeaning', `Your p-value is ${formatPValue(p)}. This is much smaller than 0.05.`);
      setText('pvalueInterpretation', 'This usually means the result is statistically significant, and the observed finding would be quite unlikely if there were truly no effect or association.');
      setText('pvalueCaution', 'Even so, statistical significance does not automatically mean the effect is large, important, or clinically meaningful.');
      showResult(box);
      return;
    }

    if (p < 0.05) {
      setText('pvalueTitle', 'Statistically significant');
      setText('pvalueMeaning', `Your p-value is ${formatPValue(p)}, which is below 0.05.`);
      setText('pvalueInterpretation', 'This usually suggests there is evidence against the null hypothesis, so your result is commonly described as statistically significant.');
      setText('pvalueCaution', 'You should still report the actual p-value, effect size, confidence interval, and the practical meaning of the finding.');
      showResult(box);
      return;
    }

    if (Math.abs(p - 0.05) < 1e-12) {
      setText('pvalueTitle', 'Borderline result');
      setText('pvalueMeaning', 'Your p-value is exactly 0.05.');
      setText('pvalueInterpretation', 'Some people may call this statistically significant, while others may describe it as borderline or marginal. Interpretation should be cautious.');
      setText('pvalueCaution', 'Do not rely only on the threshold. Consider confidence intervals, study design, sample size, and the direction of the effect.');
      showResult(box);
      return;
    }

    if (p <= 0.10) {
      setText('pvalueTitle', 'Not statistically significant, but close');
      setText('pvalueMeaning', `Your p-value is ${formatPValue(p)}, which is above 0.05.`);
      setText('pvalueInterpretation', 'This generally means the result is not statistically significant at the 5% level, though some may describe it as a weak trend or suggestive finding.');
      setText('pvalueCaution', 'Avoid claiming significance. A better approach is to report the result honestly and discuss whether a larger study or better-powered design may clarify the finding.');
      showResult(box);
      return;
    }

    setText('pvalueTitle', 'Not statistically significant');
    setText('pvalueMeaning', `Your p-value is ${formatPValue(p)}, which is above 0.05.`);
    setText('pvalueInterpretation', 'This usually means there is not enough evidence to reject the null hypothesis based on the selected significance level.');
    setText('pvalueCaution', 'This does not prove that there is no effect. It may also reflect small sample size, high variability, weak association, or limited statistical power.');
    showResult(box);
  };

  document.getElementById('explainPBtn').addEventListener('click', explain);
  document.getElementById('resetPBtn').addEventListener('click', () => {
    input.value = '';
    hideResult(box);
  });
  bindEnterKey(['pvalueInput'], explain);
}

function initTool03ChartChooser() {
  const ids = ['chartGoal', 'chartDataType', 'chartGroups', 'chartTime'];
  const box = document.getElementById('chartResultBox');

  const setResult = (name, reason, extra = '') => {
    setText('chartName', name);
    setText('chartReason', reason);
    setText('chartExtra', extra);
    showResult(box);
  };

  const chooseChart = () => {
    const [goalVal, dataType, groupsVal, time] = ids.map((id) => document.getElementById(id).value);

    if ([goalVal, dataType, groupsVal, time].some((value) => !value)) {
      setResult('Incomplete selection', 'Please answer all four questions so the tool can recommend the most suitable chart.', 'Once all fields are selected, click “Choose Chart” again.');
      return;
    }

    if (goalVal === 'trend' && time === 'yes') {
      setResult('Line Chart', 'A line chart is usually best for showing how a value changes across time points.', 'This works well for monthly trends, yearly trends, growth patterns, and repeated measurements over time.');
      return;
    }
    if (goalVal === 'relationship' && dataType === 'continuous') {
      setResult('Scatter Plot', 'A scatter plot is ideal for showing the relationship between two numerical variables.', 'You can also add a trend line to show the direction of the relationship.');
      return;
    }
    if (goalVal === 'distribution' && dataType === 'continuous') {
      setResult('Histogram', 'A histogram is useful for showing how continuous values are distributed across intervals.', 'Use this when you want to show skewness, spread, clustering, or approximate normality.');
      return;
    }
    if (goalVal === 'compare' && dataType === 'categorical' && groupsVal === 'few') {
      setResult('Bar Chart', 'A bar chart is usually best for comparing a few categories or groups.', 'This is a strong choice for frequencies, proportions, counts, and grouped comparisons.');
      return;
    }
    if (goalVal === 'compare' && dataType === 'categorical' && groupsVal === 'many') {
      setResult('Horizontal Bar Chart', 'A horizontal bar chart is often clearer than a vertical one when there are many categories.', 'It improves readability, especially when category names are long.');
      return;
    }
    if (goalVal === 'compare' && dataType === 'continuous') {
      setResult('Box Plot', 'A box plot is useful for comparing numerical distributions across groups.', 'It shows the median, spread, and possible outliers, which can be more informative than bars alone.');
      return;
    }
    if (goalVal === 'composition' && dataType === 'categorical' && groupsVal === 'few') {
      setResult('Pie Chart', 'A pie chart can be used when you want to show parts of a whole and the number of categories is small.', 'Use it sparingly. In many academic and business cases, a bar chart is still clearer.');
      return;
    }
    if (goalVal === 'composition' && groupsVal === 'many') {
      setResult('Stacked Bar Chart', 'A stacked bar chart is usually better than a pie chart when there are many categories or subgroups.', 'It helps compare composition across groups more clearly.');
      return;
    }

    setResult('Bar Chart', 'A bar chart is a safe and flexible default for many datasets.', 'But for a more polished choice, the exact chart should depend on your variables, audience, and message.');
  };

  document.getElementById('chooseChartBtn').addEventListener('click', chooseChart);
  document.getElementById('resetChartBtn').addEventListener('click', () => {
    ids.forEach((id) => { document.getElementById(id).value = ''; });
    hideResult(box);
  });
}

function initTool04CICalculator() {
  const ids = ['ciMean', 'ciSd', 'ciN', 'ciLevel'];
  const box = document.getElementById('ciResultBox');

  const calculate = () => {
    const mean = parseFloat(document.getElementById('ciMean').value);
    const sd = parseFloat(document.getElementById('ciSd').value);
    const n = parseFloat(document.getElementById('ciN').value);
    const z = parseFloat(document.getElementById('ciLevel').value);

    if ([mean, sd, n, z].some((v) => Number.isNaN(v))) {
      setText('ciTitle', 'Incomplete input');
      setText('ciMeaning', 'Please enter the mean, standard deviation, sample size, and confidence level.');
      setText('ciInterpretation', 'Example: mean = 52.4, SD = 8.1, n = 120, confidence = 95%.');
      setText('ciCaution', '');
      showResult(box);
      return;
    }

    if (sd < 0 || n < 2) {
      setText('ciTitle', 'Invalid input');
      setText('ciMeaning', 'Standard deviation must be 0 or more, and sample size must be at least 2.');
      setText('ciInterpretation', 'Please correct the values and try again.');
      setText('ciCaution', '');
      showResult(box);
      return;
    }

    const se = sd / Math.sqrt(n);
    const margin = z * se;
    const lower = mean - margin;
    const upper = mean + margin;

    setText('ciTitle', `${safeFixed(lower)} to ${safeFixed(upper)}`);
    setText('ciMeaning', `The estimated confidence interval around the sample mean is ${safeFixed(lower)} to ${safeFixed(upper)}.`);
    setText('ciInterpretation', `This was calculated as mean ± margin of error, where the margin of error is ${safeFixed(margin)} and the standard error is ${safeFixed(se)}.`);
    setText('ciCaution', 'This is a simple normal-approximation interval for a mean. For small samples or non-normal data, a t-based interval or other method may be more appropriate.');
    showResult(box);
  };

  document.getElementById('calcCiBtn').addEventListener('click', calculate);
  document.getElementById('resetCiBtn').addEventListener('click', () => {
    ids.forEach((id) => { document.getElementById(id).value = ''; });
    hideResult(box);
  });
  bindEnterKey(ids.filter((id) => id !== 'ciLevel'), calculate);
}

function initTool05AssumptionChecker() {
  const ids = ['assumpOutcome', 'assumpNormality', 'assumpOutliers', 'assumpVariance', 'assumpIndependence', 'assumpGoal'];
  const box = document.getElementById('assumpResultBox');

  const check = () => {
    const [outcomeVal, normalityVal, outliersVal, varianceVal, independenceVal, goalVal] = ids.map((id) => document.getElementById(id).value);

    if ([outcomeVal, normalityVal, outliersVal, varianceVal, independenceVal, goalVal].some((value) => !value)) {
      setText('assumpTitle', 'Incomplete selection');
      setText('assumpMeaning', 'Please answer all questions for a better assumption check.');
      setText('assumpInterpretation', 'The tool uses normality, outliers, variance similarity, and independence to guide you.');
      setText('assumpCaution', '');
      showResult(box);
      return;
    }

    if (independenceVal === 'no') {
      setText('assumpTitle', 'Paired, clustered, or repeated structure detected');
      setText('assumpMeaning', 'Your data may violate independence, which means standard tests like ordinary t-tests, ANOVA, and ordinary regression may not be appropriate.');
      setText('assumpInterpretation', 'You may need paired tests, repeated-measures analysis, mixed models, or generalized estimating equations depending on the design.');
      setText('assumpCaution', 'Independence is one of the most important assumptions. If it is violated, p-values and confidence intervals from ordinary methods can be misleading.');
      showResult(box);
      return;
    }

    if (outcomeVal === 'categorical') {
      setText('assumpTitle', 'Parametric normality assumptions are less central here');
      setText('assumpMeaning', 'Because your outcome is categorical, analyses such as chi-square tests or logistic-type models may be more appropriate than mean-based parametric methods.');
      setText('assumpInterpretation', 'Focus more on expected cell counts, coding, class imbalance, and model fit rather than normality of the outcome itself.');
      setText('assumpCaution', 'For sparse tables or rare outcomes, exact methods or penalized models may be needed.');
      showResult(box);
      return;
    }

    const goodNormality = normalityVal === 'yes';
    const goodOutliers = outliersVal === 'no';
    const goodVariance = varianceVal === 'yes';

    if (goodNormality && goodOutliers && goodVariance) {
      setText('assumpTitle', 'Parametric approach looks reasonable');
      setText('assumpMeaning', 'Your answers suggest that common parametric analyses may be appropriate.');
      setText('assumpInterpretation', goalVal === 'compare' ? 'You may consider a t-test or ANOVA depending on the number of groups.' : goalVal === 'correlate' ? 'You may consider Pearson correlation if other conditions are met.' : 'You may consider linear regression if the model form is appropriate.');
      setText('assumpCaution', 'You should still verify this with real plots and diagnostics such as histograms, Q–Q plots, residual plots, and variance tests where appropriate.');
      showResult(box);
      return;
    }

    if (normalityVal === 'no' || outliersVal === 'yes') {
      setText('assumpTitle', 'Non-parametric or robust methods may be safer');
      setText('assumpMeaning', 'Your data may not satisfy key assumptions for traditional mean-based parametric tests.');
      setText('assumpInterpretation', goalVal === 'compare' ? 'Consider Mann–Whitney U, Wilcoxon signed-rank, or Kruskal–Wallis depending on your design.' : goalVal === 'correlate' ? 'Consider Spearman correlation.' : 'Consider robust regression, transformations, or generalized models depending on the outcome.');
      setText('assumpCaution', 'Also inspect whether the issue comes from only a few outliers, data entry errors, or natural skewness in the variable.');
      showResult(box);
      return;
    }

    setText('assumpTitle', 'Mixed picture — review diagnostics carefully');
    setText('assumpMeaning', 'Your answers do not clearly support either a standard parametric or a clearly non-parametric choice without further checking.');
    setText('assumpInterpretation', 'Review plots, sample size, residuals, group balance, and whether transformations or robust alternatives are justified.');
    setText('assumpCaution', 'When assumptions are uncertain, it is often safer to combine statistical checks with subject-matter judgment and sensitivity analysis.');
    showResult(box);
  };

  document.getElementById('checkAssumpBtn').addEventListener('click', check);
  document.getElementById('resetAssumpBtn').addEventListener('click', () => {
    ids.forEach((id) => { document.getElementById(id).value = ''; });
    hideResult(box);
  });
}

function initTool06RegressionRecommender() {
  const ids = ['regOutcome', 'regRepeated', 'regPredictors', 'regGoal'];
  const box = document.getElementById('regResultBox');

  const recommend = () => {
    const [outcomeVal, repeatedVal, predictorsVal, goalVal] = ids.map((id) => document.getElementById(id).value);

    if ([outcomeVal, repeatedVal, predictorsVal, goalVal].some((value) => !value)) {
      setText('regTitle', 'Incomplete selection');
      setText('regMeaning', 'Please answer all four questions so the tool can recommend a regression model.');
      setText('regInterpretation', 'The outcome type is usually the most important driver of model choice.');
      setText('regCaution', '');
      showResult(box);
      return;
    }

    if (repeatedVal === 'yes') {
      if (outcomeVal === 'continuous') {
        setText('regTitle', 'Linear Mixed Model');
        setText('regMeaning', 'Because you have repeated measures or clustered observations with a continuous outcome, a linear mixed model may be appropriate.');
        setText('regInterpretation', 'This model can account for correlation within subjects, clinics, schools, sites, or repeated time points.');
        setText('regCaution', 'Choose random effects carefully and inspect residual assumptions.');
      } else {
        setText('regTitle', 'Generalized Mixed Model');
        setText('regMeaning', 'Because you have repeated measures or clustered data with a non-continuous outcome, a generalized mixed model may be appropriate.');
        setText('regInterpretation', 'Examples include mixed logistic, mixed ordinal, or mixed count models.');
        setText('regCaution', 'These models are powerful but require careful specification and interpretation.');
      }
      showResult(box);
      return;
    }

    if (outcomeVal === 'continuous') {
      setText('regTitle', predictorsVal === 'one' ? 'Simple Linear Regression' : 'Multiple Linear Regression');
      setText('regMeaning', 'A continuous outcome is typically modeled using linear regression.');
      setText('regInterpretation', goalVal === 'predict' ? 'Use this to estimate the outcome from one or more predictors.' : 'Use this to quantify how the outcome changes with the predictors while holding others constant.');
      setText('regCaution', 'Check linearity, residual normality, heteroscedasticity, influential points, and multicollinearity where relevant.');
      showResult(box);
      return;
    }

    if (outcomeVal === 'binary') {
      setText('regTitle', 'Binary Logistic Regression');
      setText('regMeaning', 'A yes-no or two-category outcome is commonly modeled with binary logistic regression.');
      setText('regInterpretation', 'Results are usually interpreted using odds ratios and confidence intervals.');
      setText('regCaution', 'Check class imbalance, sparse cells, influential observations, and calibration.');
      showResult(box);
      return;
    }

    if (outcomeVal === 'multicat') {
      setText('regTitle', 'Multinomial Logistic Regression');
      setText('regMeaning', 'An outcome with more than two unordered categories is commonly modeled with multinomial logistic regression.');
      setText('regInterpretation', 'This compares each outcome category against a reference category.');
      setText('regCaution', 'Be careful with category balance and interpretation across multiple comparisons.');
      showResult(box);
      return;
    }

    if (outcomeVal === 'ordinal') {
      setText('regTitle', 'Ordinal Logistic Regression');
      setText('regMeaning', 'An ordered categorical outcome is commonly modeled with ordinal logistic regression.');
      setText('regInterpretation', 'This is useful for scales such as poor-fair-good-excellent or strongly disagree to strongly agree.');
      setText('regCaution', 'Check whether the proportional odds assumption is reasonable.');
      showResult(box);
      return;
    }

    if (outcomeVal === 'count') {
      setText('regTitle', 'Poisson or Negative Binomial Regression');
      setText('regMeaning', 'Count outcomes are often modeled with Poisson regression, or with negative binomial regression if overdispersion is present.');
      setText('regInterpretation', 'These models are useful for event counts, visit counts, incidence, and rate-type outcomes.');
      setText('regCaution', 'Inspect overdispersion and consider exposure offsets when modelling rates.');
      showResult(box);
      return;
    }

    setText('regTitle', 'Cox Proportional Hazards Model');
    setText('regMeaning', 'Time-to-event outcomes are commonly analyzed using survival methods such as the Cox proportional hazards model.');
    setText('regInterpretation', 'This is appropriate when the timing of an event matters and censoring may be present.');
    setText('regCaution', 'Check proportional hazards and define the event and time origin clearly.');
    showResult(box);
  };

  document.getElementById('recommendRegBtn').addEventListener('click', recommend);
  document.getElementById('resetRegBtn').addEventListener('click', () => {
    ids.forEach((id) => { document.getElementById(id).value = ''; });
    hideResult(box);
  });
}

function initTool07DescriptiveInterpreter() {
  const ids = ['descMean', 'descMedian', 'descSd', 'descMin', 'descMax', 'descN'];
  const box = document.getElementById('descResultBox');

  const interpret = () => {
    const mean = parseFloat(document.getElementById('descMean').value);
    const median = parseFloat(document.getElementById('descMedian').value);
    const sd = parseFloat(document.getElementById('descSd').value);
    const min = parseFloat(document.getElementById('descMin').value);
    const max = parseFloat(document.getElementById('descMax').value);
    const n = parseFloat(document.getElementById('descN').value);

    if ([mean, median, sd, min, max, n].some((v) => Number.isNaN(v))) {
      setText('descTitle', 'Incomplete input');
      setText('descMeaning', 'Please enter all six descriptive statistics.');
      setText('descInterpretation', 'Mean, median, SD, minimum, maximum, and sample size are needed for this interpretation.');
      setText('descCaution', '');
      showResult(box);
      return;
    }

    if (sd < 0 || max < min || n < 1) {
      setText('descTitle', 'Invalid input');
      setText('descMeaning', 'Please ensure the standard deviation is not negative, the maximum is not below the minimum, and n is at least 1.');
      setText('descInterpretation', 'Review your values and try again.');
      setText('descCaution', '');
      showResult(box);
      return;
    }

    const range = max - min;
    const skewDiff = Math.abs(mean - median);
    const sdRatio = mean !== 0 ? Math.abs(sd / mean) : null;

    let shapeText = 'The mean and median are close, which suggests the distribution may be roughly symmetric.';
    if (skewDiff >= sd * 0.15) {
      shapeText = mean > median ? 'The mean is higher than the median, which may suggest right-skewness.' : 'The mean is lower than the median, which may suggest left-skewness.';
    }

    let spreadText = 'The variability should be interpreted directly from the standard deviation and range.';
    if (sdRatio !== null) {
      if (sdRatio < 0.2) spreadText = 'The variability appears relatively low compared with the mean.';
      else if (sdRatio < 0.5) spreadText = 'The variability appears moderate compared with the mean.';
      else spreadText = 'The variability appears relatively high compared with the mean.';
    }

    setText('descTitle', `n = ${Math.round(n)}, mean = ${safeFixed(mean)}, SD = ${safeFixed(sd)}`);
    setText('descMeaning', `The observed values range from ${safeFixed(min)} to ${safeFixed(max)}, giving a range of ${safeFixed(range)}.`);
    setText('descInterpretation', `${shapeText} ${spreadText}`);
    setText('descCaution', 'This is only a quick interpretation. Histograms, box plots, and Q–Q plots are still important for understanding the full data distribution.');
    showResult(box);
  };

  document.getElementById('interpretDescBtn').addEventListener('click', interpret);
  document.getElementById('resetDescBtn').addEventListener('click', () => {
    ids.forEach((id) => { document.getElementById(id).value = ''; });
    hideResult(box);
  });
  bindEnterKey(ids, interpret);
}

function initTool08CronbachGuide() {
  const ids = ['alphaValue', 'alphaItems', 'alphaUse', 'alphaReverse'];
  const box = document.getElementById('alphaResultBox');

  const interpret = () => {
    const a = parseFloat(document.getElementById('alphaValue').value);
    const items = parseFloat(document.getElementById('alphaItems').value);
    const use = document.getElementById('alphaUse').value;
    const reverse = document.getElementById('alphaReverse').value;

    if (Number.isNaN(a) || Number.isNaN(items) || !use || !reverse) {
      setText('alphaTitle', 'Incomplete input');
      setText('alphaMeaning', 'Please enter the alpha value, number of items, intended use, and reverse-coding status.');
      setText('alphaInterpretation', 'This helps the tool give a more useful reliability interpretation.');
      setText('alphaCaution', '');
      showResult(box);
      return;
    }

    if (a < 0 || a > 1 || items < 1) {
      setText('alphaTitle', 'Invalid input');
      setText('alphaMeaning', 'Cronbach’s alpha must be between 0 and 1, and the number of items must be at least 1.');
      setText('alphaInterpretation', 'Please review your values and try again.');
      setText('alphaCaution', '');
      showResult(box);
      return;
    }

    let level = 'excellent';
    if (a < 0.60) level = 'poor';
    else if (a < 0.70) level = 'questionable';
    else if (a < 0.80) level = 'acceptable';
    else if (a < 0.90) level = 'good';

    setText('alphaTitle', `Cronbach’s alpha = ${safeFixed(a)}`);
    setText('alphaMeaning', `This suggests ${level} internal consistency for the scale or instrument.`);

    const useText = use === 'pilot'
      ? 'For pilot work, a modest alpha may still be useful if the instrument is being refined.'
      : use === 'research'
        ? 'For academic research, values around 0.70 or higher are often considered acceptable, depending on context.'
        : 'For applied or screening settings, stronger reliability is often preferred because decisions may depend on the score.';

    setText('alphaInterpretation', `${useText} Your scale has ${Math.round(items)} item(s), so reliability should also be considered alongside item quality and construct validity.`);
    setText('alphaCaution', reverse === 'no'
      ? 'Reverse-coded items not handled correctly can severely reduce Cronbach’s alpha and make the scale look unreliable.'
      : reverse === 'unsure'
        ? 'If reverse-coded items are present and not handled correctly, the alpha value may be misleadingly low.'
        : 'Cronbach’s alpha should not be used alone. Also inspect item-total correlations, dimensionality, and whether all items truly measure the same construct.');
    showResult(box);
  };

  document.getElementById('interpretAlphaBtn').addEventListener('click', interpret);
  document.getElementById('resetAlphaBtn').addEventListener('click', () => {
    ids.forEach((id) => { document.getElementById(id).value = ''; });
    hideResult(box);
  });
  bindEnterKey(['alphaValue', 'alphaItems'], interpret);
}

function initTool09SurveyChecklist() {
  const ids = ['surveyMissing', 'surveyDuplicates', 'surveyScales'];
  const box = document.getElementById('checklistResultBox');
  const list = document.getElementById('checklistItems');

  const addItem = (text) => {
    const item = document.createElement('div');
    item.className = 'check-item';
    item.innerHTML = '<div class="check-icon">✓</div><div></div>';
    item.lastElementChild.textContent = text;
    list.appendChild(item);
  };

  const build = () => {
    const [missing, duplicates, scales] = ids.map((id) => document.getElementById(id).value);

    if ([missing, duplicates, scales].some((value) => !value)) {
      setText('checklistTitle', 'Incomplete selection');
      setText('checklistMeaning', 'Please answer all three questions to generate your checklist.');
      list.innerHTML = '';
      setText('checklistCaution', '');
      showResult(box);
      return;
    }

    list.innerHTML = '';
    setText('checklistTitle', 'Academic survey cleaning priorities');
    setText('checklistMeaning', 'Use this checklist before descriptive analysis, hypothesis testing, modelling, or thesis reporting.');

    [
      'Verify variable names, labels, response options, and coding consistency.',
      'Check for impossible values, out-of-range responses, and data entry errors.',
      'Confirm that each variable has the correct data type: numeric, text, date, binary, or categorical.',
      'Check that all questionnaire items align with the study objectives, research questions, hypotheses, and variable definitions.',
      'Prepare a codebook showing variable names, labels, coding, and missing-value rules.'
    ].forEach(addItem);

    if (missing !== 'no') {
      addItem('Quantify missing values by variable and decide whether to impute, recode, exclude, or keep them as missing.');
    }

    if (duplicates !== 'no') {
      addItem('Check for duplicate records using student IDs, timestamps, phone numbers, emails, or combinations of fields.');
    }

    if (scales === 'yes') {
      addItem('Identify multi-item scales and confirm that reverse-coded items are correctly recoded before scoring.');
      addItem('Calculate scale totals or averages only after checking internal consistency and item direction.');
    }

    addItem('Document every cleaning step so your process remains transparent and reproducible.');
    setText(
      'checklistCaution',
      'Cleaning decisions can affect your results substantially. Always save a raw backup file before making changes, and keep a log of what was cleaned, recoded, merged, or removed.'
    );
    showResult(box);
  };

  document.getElementById('buildChecklistBtn').addEventListener('click', build);
  document.getElementById('resetChecklistBtn').addEventListener('click', () => {
    ids.forEach((id) => {
      document.getElementById(id).value = '';
    });
    list.innerHTML = '';
    hideResult(box);
  });
}

function initTool10PowerCalculator() {
  const ids = ['powerEffect', 'powerN1', 'powerN2', 'powerAlpha'];
  const box = document.getElementById('powerResultBox');

  const estimate = () => {
    const d = parseFloat(document.getElementById('powerEffect').value);
    const n1 = parseFloat(document.getElementById('powerN1').value);
    const n2 = parseFloat(document.getElementById('powerN2').value);
    const alpha = parseFloat(document.getElementById('powerAlpha').value);

    if ([d, n1, n2, alpha].some((v) => Number.isNaN(v))) {
      setText('powerTitle', 'Incomplete input');
      setText('powerMeaning', 'Please enter effect size, both group sample sizes, and alpha.');
      setText('powerInterpretation', 'This calculator gives a quick approximation for a two-group comparison.');
      setText('powerCaution', '');
      showResult(box);
      return;
    }

    if (n1 < 2 || n2 < 2 || d < 0 || alpha <= 0 || alpha >= 1) {
      setText('powerTitle', 'Invalid input');
      setText('powerMeaning', 'Use a non-negative effect size, group sizes of at least 2, and alpha between 0 and 1.');
      setText('powerInterpretation', 'Please revise the values and try again.');
      setText('powerCaution', '');
      showResult(box);
      return;
    }

    const zAlpha = getTwoSidedCriticalZ(alpha);
    const nEff = (n1 * n2) / (n1 + n2);
    const zEffect = Math.abs(d) * Math.sqrt(nEff);
    const power = normalCdf(zEffect - zAlpha);
    const pct = Math.max(0, Math.min(0.999, power)) * 100;
    const verdict = pct >= 80 ? 'Adequate power' : pct >= 60 ? 'Moderate power' : 'Low power';

    setText('powerTitle', `${verdict}: ${safeFixed(pct, 1)}%`);
    setText('powerMeaning', `The approximate power for detecting an effect size of d = ${safeFixed(d, 2)} with n₁ = ${Math.round(n1)} and n₂ = ${Math.round(n2)} at alpha ${safeFixed(alpha, 2)} is ${safeFixed(pct, 1)}%.`);
    setText('powerInterpretation', pct >= 80 ? 'This is often considered acceptable for many planned studies, though the target may vary by field.' : 'This suggests the study may be underpowered, which increases the chance of missing a real effect.');
    setText('powerCaution', 'This is a simple approximation for two-group designs and should not replace a full power analysis for complex models, unequal variances, clustering, repeated measures, or non-standard outcomes.');
    showResult(box);
  };

  document.getElementById('calcPowerBtn').addEventListener('click', estimate);
  document.getElementById('resetPowerBtn').addEventListener('click', () => {
    ids.forEach((id) => { document.getElementById(id).value = ''; });
    hideResult(box);
  });
  bindEnterKey(['powerEffect', 'powerN1', 'powerN2'], estimate);
}

function initTool11SampleSizeEstimator() {
  const ids = ['ssPrevalence', 'ssMargin', 'ssConfidence', 'ssPopulation'];
  const box = document.getElementById('sampleResultBox');

  const estimate = () => {
    const p = parseFloat(document.getElementById('ssPrevalence').value);
    const e = parseFloat(document.getElementById('ssMargin').value);
    const z = parseFloat(document.getElementById('ssConfidence').value);
    const popRaw = document.getElementById('ssPopulation').value.trim();
    const N = popRaw === '' ? null : parseFloat(popRaw);

    if ([p, e, z].some((v) => Number.isNaN(v))) {
      setText('sampleTitle', 'Incomplete input');
      setText('sampleMeaning', 'Please enter expected prevalence, margin of error, and confidence level.');
      setText('sampleInterpretation', 'Population size is optional and used only for finite population correction.');
      setText('sampleCaution', '');
      showResult(box);
      return;
    }

    if (p < 0 || p > 1 || e <= 0 || e >= 1 || (N !== null && (Number.isNaN(N) || N < 1))) {
      setText('sampleTitle', 'Invalid input');
      setText('sampleMeaning', 'Use prevalence between 0 and 1, a margin of error between 0 and 1, and a valid optional population size.');
      setText('sampleInterpretation', 'Please review the values and try again.');
      setText('sampleCaution', '');
      showResult(box);
      return;
    }

    const q = 1 - p;
    const n0 = (z * z * p * q) / (e * e);
    const nAdj = N ? (n0 / (1 + ((n0 - 1) / N))) : n0;
    const rounded = Math.ceil(nAdj);

    setText('sampleTitle', `Required sample ≈ ${rounded}`);
    setText('sampleMeaning', `Using p = ${safeFixed(p, 3)}, q = ${safeFixed(q, 3)}, margin of error = ${safeFixed(e, 3)}, and z = ${safeFixed(z, 3)}, the estimated sample size is ${rounded}.`);
    setText('sampleInterpretation', N ? `A finite population correction was applied using population size N = ${Math.round(N)}.` : 'No finite population correction was applied because no population size was entered.');
    setText('sampleCaution', 'This estimate is for a simple proportion under simple random sampling. You may still need to adjust upward for design effect, subgroup analysis, attrition, or non-response.');
    showResult(box);
  };

  document.getElementById('calcSampleBtn').addEventListener('click', estimate);
  document.getElementById('resetSampleBtn').addEventListener('click', () => {
    ids.forEach((id) => { document.getElementById(id).value = ''; });
    hideResult(box);
  });
  bindEnterKey(['ssPrevalence', 'ssMargin', 'ssPopulation'], estimate);
}
