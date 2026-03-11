import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

class ProductivityPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.is_trained = False
        
    def train_model(self, data_path='../../App4080-Project/Machine Learning/Datasets/ultimate_student_productivity_dataset_5000.csv'):
        """Train the productivity prediction model"""
        try:
            # Load dataset
            data = pd.read_csv(data_path)
            
            # Feature engineering
            data['distractions'] = data['social_media_hours'] + data['gaming_hours'] + data['screen_time_hours']
            data['focus_time'] = data['focus_index']
            
            # Select features
            X = data[['study_hours', 'sleep_hours', 'distractions', 'focus_time']]
            
            # Create productivity categories
            data['productivity_category'] = pd.cut(data['productivity_score'],
                                                   bins=[0, 40, 70, 100],
                                                   labels=["Low", "Medium", "High"])
            y = data['productivity_category']
            
            # Scale features
            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(X)
            
            # Train model
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
            self.model.fit(X_scaled, y)
            
            self.is_trained = True
            print("✅ Model trained successfully")
            return True
            
        except Exception as e:
            print(f"❌ Training error: {e}")
            return False
    
    def predict_productivity(self, study_hours, sleep_hours, social_media_hours, gaming_hours, screen_time_hours, focus_index):
        """Predict productivity level for a student"""
        if not self.is_trained:
            return None
        
        try:
            # Calculate features
            distractions = social_media_hours + gaming_hours + screen_time_hours
            focus_time = focus_index
            
            # Create feature array
            features = np.array([[study_hours, sleep_hours, distractions, focus_time]])
            
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Predict
            prediction = self.model.predict(features_scaled)[0]
            probabilities = self.model.predict_proba(features_scaled)[0]
            
            return {
                'prediction': prediction,
                'confidence': {
                    'Low': round(float(probabilities[0]) * 100, 2),
                    'Medium': round(float(probabilities[1]) * 100, 2),
                    'High': round(float(probabilities[2]) * 100, 2)
                }
            }
            
        except Exception as e:
            print(f"❌ Prediction error: {e}")
            return None
    
    def get_recommendations(self, study_hours, sleep_hours, social_media_hours, gaming_hours, screen_time_hours, focus_index):
        """Generate personalized recommendations"""
        recommendations = []
        
        # Sleep recommendations
        if sleep_hours < 6:
            recommendations.append({
                'type': 'critical',
                'category': 'Sleep',
                'message': f'You\'re only getting {sleep_hours:.1f} hours of sleep. Aim for 7-9 hours for optimal performance.',
                'action': 'Increase sleep by at least 1-2 hours'
            })
        elif sleep_hours < 7:
            recommendations.append({
                'type': 'warning',
                'category': 'Sleep',
                'message': f'Your sleep ({sleep_hours:.1f}h) is below optimal. Try to get 7-9 hours.',
                'action': 'Add 30-60 minutes to your sleep schedule'
            })
        
        # Study hours recommendations
        if study_hours < 3:
            recommendations.append({
                'type': 'warning',
                'category': 'Study Time',
                'message': f'Only {study_hours:.1f} hours of study time. Consider increasing to 4-6 hours daily.',
                'action': 'Schedule 2-3 focused study sessions per day'
            })
        elif study_hours > 8:
            recommendations.append({
                'type': 'warning',
                'category': 'Study Time',
                'message': f'{study_hours:.1f} hours is a lot! Risk of burnout. Take regular breaks.',
                'action': 'Use Pomodoro technique: 25min study, 5min break'
            })
        
        # Distraction recommendations
        total_distractions = social_media_hours + gaming_hours + screen_time_hours
        if total_distractions > 5:
            recommendations.append({
                'type': 'critical',
                'category': 'Distractions',
                'message': f'{total_distractions:.1f} hours on distractions daily. This significantly impacts productivity.',
                'action': 'Reduce social media and gaming by 50%. Use app blockers during study time.'
            })
        elif total_distractions > 3:
            recommendations.append({
                'type': 'warning',
                'category': 'Distractions',
                'message': f'{total_distractions:.1f} hours on distractions. Try to reduce to under 2 hours.',
                'action': 'Set daily limits on social media apps'
            })
        
        # Focus recommendations
        if focus_index < 30:
            recommendations.append({
                'type': 'critical',
                'category': 'Focus',
                'message': f'Low focus score ({focus_index:.1f}). Difficulty concentrating affects learning.',
                'action': 'Try meditation, remove distractions, study in quiet environment'
            })
        elif focus_index < 50:
            recommendations.append({
                'type': 'info',
                'category': 'Focus',
                'message': f'Moderate focus ({focus_index:.1f}). Room for improvement.',
                'action': 'Use focus techniques like Pomodoro, minimize multitasking'
            })
        
        # Positive reinforcement
        if sleep_hours >= 7 and sleep_hours <= 9:
            recommendations.append({
                'type': 'success',
                'category': 'Sleep',
                'message': f'Great sleep schedule ({sleep_hours:.1f}h)! Keep it up.',
                'action': 'Maintain this healthy sleep pattern'
            })
        
        if study_hours >= 4 and study_hours <= 7:
            recommendations.append({
                'type': 'success',
                'category': 'Study Time',
                'message': f'Excellent study hours ({study_hours:.1f}h). Well balanced!',
                'action': 'Continue this effective study routine'
            })
        
        if total_distractions < 2:
            recommendations.append({
                'type': 'success',
                'category': 'Distractions',
                'message': f'Low distractions ({total_distractions:.1f}h). Excellent self-control!',
                'action': 'Keep maintaining this discipline'
            })
        
        return recommendations
    
    def calculate_burnout_risk(self, study_hours, sleep_hours, social_media_hours, gaming_hours, upcoming_deadlines):
        """Calculate burnout risk score (0-100)"""
        risk_score = 0
        
        # Sleep deprivation risk
        if sleep_hours < 6:
            risk_score += 30
        elif sleep_hours < 7:
            risk_score += 15
        
        # Overwork risk
        if study_hours > 8:
            risk_score += 25
        elif study_hours > 6:
            risk_score += 10
        
        # Lack of breaks/recreation
        recreation = social_media_hours + gaming_hours
        if recreation < 0.5:
            risk_score += 20
        
        # Deadline pressure
        if upcoming_deadlines > 3:
            risk_score += 15
        elif upcoming_deadlines > 1:
            risk_score += 10
        
        # Cap at 100
        risk_score = min(risk_score, 100)
        
        if risk_score >= 70:
            level = 'High'
            message = 'High burnout risk! Take immediate action to reduce stress.'
        elif risk_score >= 40:
            level = 'Medium'
            message = 'Moderate burnout risk. Consider adjusting your schedule.'
        else:
            level = 'Low'
            message = 'Low burnout risk. Keep maintaining balance!'
        
        return {
            'score': risk_score,
            'level': level,
            'message': message
        }

# Global predictor instance
predictor = ProductivityPredictor()
