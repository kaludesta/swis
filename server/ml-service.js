import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MLService {
  constructor() {
    this.pythonPath = 'python'; // or 'python3' on some systems
    this.scriptPath = path.join(__dirname, '../ml/predictor.py');
  }

  async callPython(method, data) {
    return new Promise((resolve, reject) => {
      const python = spawn(this.pythonPath, ['-c', `
import sys
import json
sys.path.append('${path.join(__dirname, '../ml').replace(/\\/g, '\\\\')}')
from predictor import predictor

# Train model if not trained
if not predictor.is_trained:
    predictor.train_model()

method = '${method}'
data = json.loads('${JSON.stringify(data).replace(/'/g, "\\'")}')

if method == 'predict':
    result = predictor.predict_productivity(
        data['study_hours'],
        data['sleep_hours'],
        data['social_media_hours'],
        data['gaming_hours'],
        data['screen_time_hours'],
        data['focus_index']
    )
elif method == 'recommend':
    result = predictor.get_recommendations(
        data['study_hours'],
        data['sleep_hours'],
        data['social_media_hours'],
        data['gaming_hours'],
        data['screen_time_hours'],
        data['focus_index']
    )
elif method == 'burnout':
    result = predictor.calculate_burnout_risk(
        data['study_hours'],
        data['sleep_hours'],
        data['social_media_hours'],
        data['gaming_hours'],
        data['upcoming_deadlines']
    )
else:
    result = None

print(json.dumps(result))
`]);

      let dataString = '';
      let errorString = '';

      python.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorString += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}: ${errorString}`));
        } else {
          try {
            const result = JSON.parse(dataString);
            resolve(result);
          } catch (e) {
            reject(new Error(`Failed to parse Python output: ${dataString}`));
          }
        }
      });
    });
  }

  async predictProductivity(studyData) {
    return await this.callPython('predict', studyData);
  }

  async getRecommendations(studyData) {
    return await this.callPython('recommend', studyData);
  }

  async calculateBurnoutRisk(studyData) {
    return await this.callPython('burnout', studyData);
  }
}

export default new MLService();
