const express = require('express');
const app = express();
 
// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));
 
// HTML Template for the UI
const renderHTML = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fitness & BMI Calculator</title>
    <style>
        :root {
            --bg-dark: #0f1115;
            --surface: #1a1d24;
            --surface-2: #22262f;
            --primary: #00c2a8;
            --primary-dark: #00a693;
            --accent: #7c5cff;
            --text-main: #f2f3f5;
            --text-muted: #8b909c;
            --danger: #ff5c5c;
            --warn: #ffb84c;
            --success: #00e676;
            --border: #2a2e38;
        }
        * { box-sizing: border-box; }
        body {
            background:
                radial-gradient(circle at 15% 10%, rgba(124,92,255,0.12), transparent 40%),
                radial-gradient(circle at 85% 90%, rgba(0,194,168,0.12), transparent 40%),
                var(--bg-dark);
            color: var(--text-main);
            font-family: 'Segoe UI', system-ui, -apple-system, Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            margin: 0;
            padding: 40px 16px;
        }
        .container {
            background: var(--surface);
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            width: 100%;
            max-width: 460px;
            border: 1px solid var(--border);
        }
        h1 {
            text-align: center;
            margin: 0 0 6px;
            font-size: 1.6rem;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        .subtitle {
            text-align: center;
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-bottom: 28px;
        }
        .form-row { display: flex; gap: 14px; }
        .form-group { margin-bottom: 18px; flex: 1; }
        label {
            display: block;
            margin-bottom: 7px;
            color: var(--text-muted);
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }
        input, select {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: var(--surface-2);
            color: var(--text-main);
            font-size: 0.95rem;
        }
        input:focus, select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(0,194,168,0.15);
        }
        .unit-toggle {
            display: flex;
            background: var(--surface-2);
            border-radius: 8px;
            padding: 4px;
            margin-bottom: 22px;
            border: 1px solid var(--border);
        }
        .unit-option {
            flex: 1;
            display: block;
            text-align: center;
            margin: 0;
            padding: 9px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-muted);
            user-select: none;
            transition: background 0.15s, color 0.15s;
        }
        .unit-option input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
            margin: 0;
            pointer-events: none;
        }
        .unit-option.selected {
            background: var(--primary);
            color: #0f1115;
        }
        button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(90deg, var(--primary), var(--primary-dark));
            color: #0f1115;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.15s, box-shadow 0.15s;
            margin-top: 8px;
        }
        button:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,194,168,0.25); }
        button:active { transform: translateY(0); }
 
        .result-box {
            margin-top: 10px;
            padding: 22px;
            background: var(--surface-2);
            border-radius: 12px;
            text-align: center;
            border-left: 4px solid var(--primary);
            margin-bottom: 16px;
        }
        .bmi-value { font-size: 2.8rem; font-weight: 800; margin: 8px 0; line-height: 1; }
        .bmi-scale {
            display: flex;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin: 18px 0 8px;
        }
        .bmi-scale div { flex: 1; }
        .bmi-marker-wrap { position: relative; height: 18px; }
        .bmi-marker {
            position: absolute;
            top: -14px;
            transform: translateX(-50%);
            font-size: 1.1rem;
        }
        .stat-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 16px;
        }
        .stat-card {
            background: var(--surface-2);
            border-radius: 10px;
            padding: 16px;
            text-align: center;
            border: 1px solid var(--border);
        }
        .stat-card .label {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.03em;
            margin-bottom: 6px;
        }
        .stat-card .value {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--primary);
        }
        .stat-card .value.accent { color: var(--accent); }
        .advice-box {
            background: var(--surface-2);
            border-radius: 10px;
            padding: 16px 18px;
            font-size: 0.88rem;
            line-height: 1.5;
            color: var(--text-main);
            border: 1px solid var(--border);
            margin-bottom: 16px;
        }
        .advice-box strong { color: var(--primary); }
        .back-link {
            display: block;
            text-align: center;
            margin-top: 10px;
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
        }
        .back-link:hover { text-decoration: underline; }
        select option { background: var(--surface-2); }
    </style>
</head>
<body>
    <div class="container">
        ${content}
    </div>
</body>
</html>
`;
 
// GET Route: Displays the calculator form
app.get('/', (req, res) => {
    const formContent = `
        <h1>Fitness & BMI Calculator</h1>
        <p class="subtitle">Get your BMI, calorie needs, and ideal weight range</p>
        <form action="/calculate" method="POST">
 
            <label style="margin-bottom:8px;">Units</label>
            <div class="unit-toggle">
                <label class="unit-option selected" id="metric-label" for="metric">
                    <input type="radio" id="metric" name="units" value="metric" checked>
                    Metric (kg/cm)
                </label>
                <label class="unit-option" id="imperial-label" for="imperial">
                    <input type="radio" id="imperial" name="units" value="imperial">
                    Imperial (lb/in)
                </label>
            </div>
 
            <div class="form-row">
                <div class="form-group">
                    <label for="weight">Weight</label>
                    <input type="number" id="weight" name="weight" step="0.1" required placeholder="e.g., 75">
                </div>
                <div class="form-group">
                    <label for="height">Height</label>
                    <input type="number" id="height" name="height" step="0.1" required placeholder="e.g., 180">
                </div>
            </div>
 
            <div class="form-row">
                <div class="form-group">
                    <label for="age">Age</label>
                    <input type="number" id="age" name="age" step="1" required placeholder="e.g., 30" min="10" max="100">
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender" name="gender">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>
 
            <div class="form-group">
                <label for="activity">Activity Level</label>
                <select id="activity" name="activity">
                    <option value="1.2">Sedentary (little to no exercise)</option>
                    <option value="1.375">Light (exercise 1-3 days/week)</option>
                    <option value="1.55" selected>Moderate (exercise 3-5 days/week)</option>
                    <option value="1.725">Active (exercise 6-7 days/week)</option>
                    <option value="1.9">Very Active (hard training / physical job)</option>
                </select>
            </div>
 
            <div class="form-group">
                <label for="goal">Fitness Goal</label>
                <select id="goal" name="goal">
                    <option value="lose">Lose Weight</option>
                    <option value="maintain" selected>Maintain Weight</option>
                    <option value="gain">Gain Muscle / Weight</option>
                </select>
            </div>
 
            <button type="submit">Calculate My Results</button>
        </form>
        <script>
            const metricInput = document.getElementById('metric');
            const imperialInput = document.getElementById('imperial');
            const metricLabel = document.getElementById('metric-label');
            const imperialLabel = document.getElementById('imperial-label');
            const weightLabel = document.querySelector('label[for="weight"]');
            const heightLabel = document.querySelector('label[for="height"]');
            const weightInput = document.getElementById('weight');
            const heightInput = document.getElementById('height');
 
            function updateLabels() {
                if (metricInput.checked) {
                    metricLabel.classList.add('selected');
                    imperialLabel.classList.remove('selected');
                    weightLabel.textContent = 'Weight (kg)';
                    heightLabel.textContent = 'Height (cm)';
                    weightInput.placeholder = 'e.g., 75';
                    heightInput.placeholder = 'e.g., 180';
                } else {
                    imperialLabel.classList.add('selected');
                    metricLabel.classList.remove('selected');
                    weightLabel.textContent = 'Weight (lb)';
                    heightLabel.textContent = 'Height (in)';
                    weightInput.placeholder = 'e.g., 165';
                    heightInput.placeholder = 'e.g., 71';
                }
            }
            metricInput.addEventListener('change', updateLabels);
            imperialInput.addEventListener('change', updateLabels);
        </script>
    `;
    res.send(renderHTML(formContent));
});
 
// POST Route: Processes the data and returns results
app.post('/calculate', (req, res) => {
    const units = req.body.units === 'imperial' ? 'imperial' : 'metric';
    let weight = parseFloat(req.body.weight);
    let heightRaw = parseFloat(req.body.height);
    const age = parseInt(req.body.age, 10);
    const gender = req.body.gender === 'female' ? 'female' : 'male';
    const activityFactor = parseFloat(req.body.activity) || 1.55;
    const goal = req.body.goal || 'maintain';
 
    if (!weight || !heightRaw || weight <= 0 || heightRaw <= 0 || !age || age <= 0) {
        return res.send(renderHTML(`
            <h2 style="color: var(--danger); text-align: center;">Invalid Input</h2>
            <p style="text-align: center; color: var(--text-muted);">Please enter valid positive numbers for all fields.</p>
            <a href="/" class="back-link">&larr; Try Again</a>
        `));
    }
 
    // Normalize to metric (kg, cm) for calculations
    let weightKg = weight;
    let heightCm = heightRaw;
    if (units === 'imperial') {
        weightKg = weight * 0.453592;
        heightCm = heightRaw * 2.54;
    }
 
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const bmiDisplay = bmi.toFixed(1);
 
    let category = "";
    let color = "";
    if (bmi < 18.5) { category = "Underweight"; color = "var(--warn)"; }
    else if (bmi <= 24.9) { category = "Normal Weight"; color = "var(--success)"; }
    else if (bmi <= 29.9) { category = "Overweight"; color = "var(--warn)"; }
    else { category = "Obese"; color = "var(--danger)"; }
 
    // Marker position on 15-40 BMI scale, clamped 0-100%
    const scaleMin = 15, scaleMax = 40;
    const markerPct = Math.min(100, Math.max(0, ((bmi - scaleMin) / (scaleMax - scaleMin)) * 100));
 
    // BMR via Mifflin-St Jeor
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
    const tdee = bmr * activityFactor;
 
    let calorieTarget = tdee;
    let goalLabel = "Maintenance";
    if (goal === 'lose') { calorieTarget = tdee - 500; goalLabel = "Weight Loss (-500 kcal)"; }
    else if (goal === 'gain') { calorieTarget = tdee + 350; goalLabel = "Muscle Gain (+350 kcal)"; }
 
    // Ideal weight range for BMI 18.5 - 24.9, converted back to display units
    const idealMinKg = 18.5 * heightM * heightM;
    const idealMaxKg = 24.9 * heightM * heightM;
    let idealMinDisplay, idealMaxDisplay, weightUnit;
    if (units === 'imperial') {
        idealMinDisplay = (idealMinKg / 0.453592).toFixed(1);
        idealMaxDisplay = (idealMaxKg / 0.453592).toFixed(1);
        weightUnit = 'lb';
    } else {
        idealMinDisplay = idealMinKg.toFixed(1);
        idealMaxDisplay = idealMaxKg.toFixed(1);
        weightUnit = 'kg';
    }
 
    // Protein guidance (g per kg bodyweight) based on goal
    let proteinPerKg = 1.6;
    if (goal === 'gain') proteinPerKg = 1.8;
    if (goal === 'lose') proteinPerKg = 1.8;
    const proteinGrams = Math.round(weightKg * proteinPerKg);
 
    let advice = "";
    if (category === "Underweight") {
        advice = `Your BMI suggests you're <strong>underweight</strong>. Focus on nutrient-dense meals and a slight calorie surplus, paired with resistance training to build healthy mass.`;
    } else if (category === "Normal Weight") {
        advice = `Your BMI is in the <strong>healthy range</strong>. Keep up a balanced diet and regular activity to maintain it.`;
    } else if (category === "Overweight") {
        advice = `Your BMI suggests you're in the <strong>overweight</strong> range. A moderate calorie deficit combined with strength and cardio training can help you move toward the healthy range.`;
    } else {
        advice = `Your BMI falls in the <strong>obese</strong> range. Consider consulting a healthcare provider to build a safe, sustainable plan combining nutrition and gradual exercise increases.`;
    }
 
    const resultContent = `
        <h1 style="font-size:1.3rem;">Your Results</h1>
        <div class="result-box">
            <p style="margin:0; color: var(--text-muted); font-size:0.85rem; text-transform:uppercase; letter-spacing:0.03em;">Body Mass Index</p>
            <div class="bmi-value" style="color: ${color};">${bmiDisplay}</div>
            <p style="margin:0 0 14px; font-weight: 700; color: ${color};">${category}</p>
            <div class="bmi-scale">
                <div style="background:var(--warn);"></div>
                <div style="background:var(--success);"></div>
                <div style="background:var(--warn);"></div>
                <div style="background:var(--danger);"></div>
            </div>
            <div class="bmi-marker-wrap">
                <div class="bmi-marker" style="left:${markerPct}%;">&#9650;</div>
            </div>
        </div>
 
        <div class="stat-grid">
            <div class="stat-card">
                <div class="label">Daily Calories</div>
                <div class="value">${Math.round(calorieTarget)}</div>
            </div>
            <div class="stat-card">
                <div class="label">Goal</div>
                <div class="value accent" style="font-size:1rem;">${goalLabel}</div>
            </div>
            <div class="stat-card">
                <div class="label">BMR</div>
                <div class="value">${Math.round(bmr)}</div>
            </div>
            <div class="stat-card">
                <div class="label">Protein Target</div>
                <div class="value accent">${proteinGrams}g</div>
            </div>
        </div>
 
        <div class="advice-box">
            ${advice}<br><br>
            <strong>Ideal weight range:</strong> ${idealMinDisplay} - ${idealMaxDisplay} ${weightUnit}
        </div>
 
        <a href="/" class="back-link">&larr; Calculate Another</a>
    `;
 
    res.send(renderHTML(resultContent));
});
 
app.listen(5000, () => console.log('Advanced Fitness & BMI App running on port 5000'));
