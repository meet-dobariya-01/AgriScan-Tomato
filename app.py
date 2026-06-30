"""
🍅 Tomato Leaf Disease Classification
A production-ready Streamlit application for detecting tomato plant diseases
Powered by EfficientNetB0 & TensorFlow
"""

import streamlit as st
import numpy as np
from PIL import Image
import time
import os
import plotly.graph_objects as go
import plotly.express as px
from pathlib import Path

# Import utility modules
from utils.preprocessing import load_and_preprocess_image, validate_image, get_image_info
from utils.predict import TomatoDiseasePredictor
from utils.gradcam import GradCAM
from utils.disease_info import get_disease_info, get_all_diseases


# Page configuration
st.set_page_config(
    page_title="🍅 Tomato Disease Classifier",
    page_icon="🍅",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
    <style>
    .main {
        background-color: #f0f8f0;
    }
    .stButton>button {
        background-color: #4CAF50;
        color: white;
        border-radius: 10px;
        padding: 10px 24px;
        font-size: 16px;
    }
    .stButton>button:hover {
        background-color: #45a049;
    }
    .disease-card {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 10px 0;
    }
    .metric-card {
        background-color: #e8f5e9;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #4CAF50;
    }
    .title-text {
        color: #2e7d32;
        font-weight: bold;
    }
    </style>
""", unsafe_allow_html=True)


# Initialize session state
if 'prediction_history' not in st.session_state:
    st.session_state.prediction_history = []


@st.cache_resource
def load_model():
    """Load the trained model (cached)"""
    import os
    # Use absolute path relative to this script's location
    base_dir = Path(__file__).parent
    model_path = str(base_dir / "model" / "best_model.h5")
    
    # Debug info
    st.write(f"🔍 Looking for model at: `{model_path}`")
    st.write(f"📁 File exists: `{os.path.exists(model_path)}`")
    st.write(f"📂 Files in model dir: `{os.listdir(str(base_dir / 'model')) if os.path.exists(str(base_dir / 'model')) else 'model dir missing'}`")
    
    predictor = TomatoDiseasePredictor(model_path)
    if predictor.load_model():
        return predictor
    return None


def create_confidence_gauge(confidence: float):
    """Create a circular confidence gauge using Plotly"""
    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=confidence * 100,
        domain={'x': [0, 1], 'y': [0, 1]},
        title={'text': "Confidence", 'font': {'size': 24}},
        number={'suffix': "%", 'font': {'size': 40}},
        gauge={
            'axis': {'range': [None, 100], 'tickwidth': 1, 'tickcolor': "darkgreen"},
            'bar': {'color': "darkgreen"},
            'bgcolor': "white",
            'borderwidth': 2,
            'bordercolor': "gray",
            'steps': [
                {'range': [0, 50], 'color': '#ffebee'},
                {'range': [50, 75], 'color': '#fff9c4'},
                {'range': [75, 100], 'color': '#c8e6c9'}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': 90
            }
        }
    ))
    
    fig.update_layout(
        height=300,
        margin=dict(l=20, r=20, t=40, b=20)
    )
    return fig


def create_probability_chart(top_predictions):
    """Create horizontal bar chart for top predictions"""
    diseases = [pred['disease'].replace('_', ' ') for pred in top_predictions]
    probabilities = [pred['percentage'] for pred in top_predictions]
    
    fig = go.Figure(go.Bar(
        x=probabilities,
        y=diseases,
        orientation='h',
        marker=dict(
            color=probabilities,
            colorscale='Greens',
            showscale=False
        ),
        text=[f"{p:.2f}%" for p in probabilities],
        textposition='outside'
    ))
    
    fig.update_layout(
        title="Top 3 Predictions",
        xaxis_title="Probability (%)",
        yaxis_title="Disease",
        height=300,
        margin=dict(l=20, r=20, t=40, b=20),
        yaxis={'categoryorder': 'total ascending'}
    )
    
    return fig


def display_disease_info_card(disease_name: str):
    """Display disease information in a styled card"""
    info = get_disease_info(disease_name)
    
    st.markdown(f"""
    <div class="disease-card">
        <h2 style="color: #2e7d32;">🦠 {info['name']}</h2>
        <p><strong>Scientific Name:</strong> <em>{info['scientific_name']}</em></p>
        <p><strong>Severity:</strong> <span style="color: {'red' if 'Critical' in info['severity'] or 'High' in info['severity'] else 'orange' if 'Medium' in info['severity'] else 'green'};">{info['severity']}</span></p>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 📋 Description")
        st.write(info['description'])
        
        st.markdown("### 🔍 Symptoms")
        for symptom in info['symptoms']:
            st.write(f"• {symptom}")
        
        st.markdown("### 🧪 Causes")
        for cause in info['causes']:
            st.write(f"• {cause}")
    
    with col2:
        st.markdown("### 💊 Treatment")
        for treatment in info['treatment']:
            st.write(f"• {treatment}")
        
        st.markdown("### 🛡️ Prevention")
        for prevention in info['prevention']:
            st.write(f"• {prevention}")


def main():
    """Main application function"""
    
    # Header
    st.markdown("<h1 class='title-text' style='text-align: center;'>🍅 Tomato Leaf Disease Classification</h1>", unsafe_allow_html=True)
    st.markdown("<h4 style='text-align: center; color: #666;'>Powered by EfficientNetB0 & TensorFlow</h4>", unsafe_allow_html=True)
    st.markdown("---")
    
    # Load model
    predictor = load_model()
    
    if predictor is None:
        st.error("❌ Failed to load model. Please ensure 'model/best_model.h5' exists.")
        return
    
    # Sidebar
    with st.sidebar:
        st.image("https://img.icons8.com/color/96/000000/tomato.png", width=100)
        st.title("📊 Project Information")
        
        model_info = predictor.get_model_info()
        
        st.markdown("### Model Details")
        st.info(f"""
        **Model Architecture:** {model_info['model_name']}  
        **Number of Classes:** {model_info['num_classes']}  
        **Input Size:** 224×224×3  
        **Model Size:** {model_info['model_size_mb']} MB
        """)
        
        st.markdown("### 🔬 Supported Diseases")
        diseases = get_all_diseases()
        for disease in diseases:
            st.write(f"• {disease.replace('_', ' ')}")
        
        st.markdown("---")
        st.markdown("### 👨‍💻 Developer Information")
        st.write("**Project:** Tomato Disease Classification")
        st.write("**Framework:** TensorFlow/Keras")
        st.write("**UI:** Streamlit")
        
        st.markdown("---")
        st.markdown("### 📖 Prediction Guide")
        st.write("""
        1. Upload a clear image of a tomato leaf
        2. Ensure good lighting and focus
        3. Wait for the model to analyze
        4. Review the prediction and disease information
        """)
    
    # Main content
    tab1, tab2, tab3 = st.tabs(["🔮 Prediction", "📊 History", "ℹ️ About"])
    
    with tab1:
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.markdown("### 📤 Upload Image")
            uploaded_file = st.file_uploader(
                "Choose a tomato leaf image...",
                type=['jpg', 'jpeg', 'png'],
                help="Upload a clear image of a tomato leaf"
            )
            
            if uploaded_file is not None:
                # Display uploaded image
                image = Image.open(uploaded_file)
                st.image(image, caption="Uploaded Image", use_container_width=True)
                
                # Get image info
                img_info = get_image_info(uploaded_file)
                st.markdown(f"""
                <div class="metric-card">
                    <strong>Image Info:</strong><br>
                    📏 Resolution: {img_info['width']}×{img_info['height']}<br>
                    📁 Format: {img_info['format']}<br>
                    🎨 Mode: {img_info['mode']}
                </div>
                """, unsafe_allow_html=True)
                
                # Predict button
                if st.button("🔍 Analyze Image", use_container_width=True):
                    with st.spinner("🔄 Analyzing image..."):
                        try:
                            # Preprocess image
                            uploaded_file.seek(0)  # Reset file pointer
                            processed_image = load_and_preprocess_image(uploaded_file)
                            
                            # Make prediction
                            result = predictor.predict(processed_image)
                            top_predictions = predictor.get_top_n_predictions(processed_image, top_n=3)
                            
                            # Store in history
                            st.session_state.prediction_history.append({
                                'disease': result['predicted_class'],
                                'confidence': result['confidence_percentage'],
                                'time': time.strftime("%Y-%m-%d %H:%M:%S")
                            })
                            
                            # Display results in right column
                            with col2:
                                st.markdown("### 🎯 Prediction Results")
                                
                                # Main prediction
                                st.success(f"**Detected Disease:** {result['predicted_class'].replace('_', ' ')}")
                                
                                # Metrics
                                metric_col1, metric_col2 = st.columns(2)
                                with metric_col1:
                                    st.metric("Confidence", f"{result['confidence_percentage']:.2f}%")
                                with metric_col2:
                                    st.metric("Inference Time", f"{result['inference_time']:.3f}s")
                                
                                # Confidence gauge
                                st.plotly_chart(
                                    create_confidence_gauge(result['confidence']),
                                    use_container_width=True
                                )
                                
                                # Top 3 predictions
                                st.markdown("### 📊 Top 3 Predictions")
                                for i, pred in enumerate(top_predictions, 1):
                                    st.write(f"{i}. **{pred['disease'].replace('_', ' ')}** - {pred['percentage']:.2f}%")
                                
                                # Probability chart
                                st.plotly_chart(
                                    create_probability_chart(top_predictions),
                                    use_container_width=True
                                )
                            
                            # Grad-CAM visualization
                            st.markdown("---")
                            st.markdown("### 🔥 Grad-CAM Visualization")
                            st.info("Grad-CAM shows which parts of the image the model focused on for making the prediction.")
                            
                            with st.spinner("Generating Grad-CAM..."):
                                try:
                                    gradcam = GradCAM(predictor.model)
                                    gradcam_results = gradcam.generate_gradcam(
                                        processed_image,
                                        image
                                    )
                                    
                                    gcol1, gcol2, gcol3 = st.columns(3)
                                    with gcol1:
                                        st.image(gradcam_results['original'], caption="Original", use_container_width=True)
                                    with gcol2:
                                        st.image(gradcam_results['heatmap'], caption="Heatmap", use_container_width=True)
                                    with gcol3:
                                        st.image(gradcam_results['superimposed'], caption="Overlay", use_container_width=True)
                                except Exception as e:
                                    st.warning(f"Grad-CAM visualization not available: {str(e)}")
                            
                            # Disease information
                            st.markdown("---")
                            st.markdown("### 📚 Disease Information")
                            display_disease_info_card(result['predicted_class'])
                            
                        except Exception as e:
                            st.error(f"❌ Error during prediction: {str(e)}")
        
        with col2:
            if uploaded_file is None:
                st.markdown("### 💡 Getting Started")
                st.info("""
                👈 Upload a tomato leaf image to get started!
                
                **Tips for best results:**
                - Use clear, well-lit images
                - Focus on the leaf with visible symptoms
                - Avoid blurry or low-quality images
                - Supported formats: JPG, JPEG, PNG
                """)
                
                st.markdown("### 🌿 Example Diseases")
                example_diseases = ["Bacterial Spot", "Early Blight", "Late Blight", "Healthy Leaf"]
                for disease in example_diseases:
                    st.write(f"✓ {disease}")
    
    with tab2:
        st.markdown("### 📜 Prediction History")
        
        if st.session_state.prediction_history:
            col1, col2 = st.columns([3, 1])
            with col2:
                if st.button("🗑️ Clear History"):
                    st.session_state.prediction_history = []
                    st.rerun()
            
            # Display history
            for i, pred in enumerate(reversed(st.session_state.prediction_history), 1):
                st.markdown(f"""
                <div class="disease-card">
                    <strong>#{i}</strong> - {pred['disease'].replace('_', ' ')}<br>
                    Confidence: {pred['confidence']:.2f}%<br>
                    Time: {pred['time']}
                </div>
                """, unsafe_allow_html=True)
        else:
            st.info("No predictions yet. Upload an image to get started!")
    
    with tab3:
        st.markdown("### 📖 About This Application")
        st.write("""
        This is a **production-ready AI application** for detecting tomato leaf diseases using deep learning.
        
        **Key Features:**
        - 🎯 Accurate disease classification using EfficientNetB0
        - 🔥 Grad-CAM visualization for model interpretability
        - 📊 Detailed disease information and treatment recommendations
        - ⚡ Fast inference time (<1 second)
        - 📱 Responsive and user-friendly interface
        
        **Technology Stack:**
        - **Deep Learning:** TensorFlow/Keras
        - **Model Architecture:** EfficientNetB0 (Transfer Learning)
        - **UI Framework:** Streamlit
        - **Visualization:** Plotly, OpenCV
        - **Image Processing:** PIL, NumPy
        
        **Model Performance:**
        - Trained on 25,000+ images
        - 11 disease classes
        - High accuracy on validation set
        
        **Use Cases:**
        - Early disease detection in tomato crops
        - Agricultural decision support
        - Educational tool for plant pathology
        - Research and development
        """)
        
        st.markdown("---")
        st.markdown("### 🚀 Future Enhancements")
        st.write("""
        - 📱 Mobile app deployment
        - 🌐 REST API for integration
        - 📊 Batch processing capability
        - 🔄 Model retraining pipeline
        - 🌍 Multi-language support
        """)


if __name__ == "__main__":
    main()
