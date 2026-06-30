# 🚀 Quick Start Guide

Get your Tomato Disease Classification app running in 5 minutes!

## ⚡ Quick Setup

### Option 1: Basic Setup (Recommended)

```bash
# Navigate to project directory
cd Tomato_Disease_Classification

# Install dependencies
pip install -r requirements.txt

# Run the app
streamlit run app.py
```

That's it! The app will open in your browser at `http://localhost:8501`

---

### Option 2: With Virtual Environment (Best Practice)

```bash
# Navigate to project directory
cd Tomato_Disease_Classification

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the app
streamlit run app.py
```

---

## 🎯 First Time Usage

1. **Upload an Image**
   - Click "Browse files" button
   - Select a tomato leaf image (JPG, JPEG, or PNG)
   - Or use sample images from `sample_images/` folder

2. **Click Analyze**
   - Press the "🔍 Analyze Image" button
   - Wait ~1 second for results

3. **View Results**
   - See predicted disease with confidence score
   - Check Top 3 predictions
   - View Grad-CAM visualization
   - Read disease information and treatment

---

## 📝 Testing the App

Use the sample images in `sample_images/` folder to test:

```bash
sample_images/
├── bacterial_spot_example.JPG
├── early_blight_example.JPG
└── healthy_example.JPG
```

---

## ⚙️ Troubleshooting

### Issue: Module not found

**Solution:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: Model not found

**Solution:**
Ensure `model/best_model.h5` exists in the project directory.

### Issue: Port already in use

**Solution:**
```bash
streamlit run app.py --server.port 8502
```

---

## 🎨 Customization

### Change Port
```bash
streamlit run app.py --server.port 8080
```

### Auto-reload on Save
```bash
streamlit run app.py --server.runOnSave true
```

### Open in Browser Automatically
```bash
streamlit run app.py --server.headless false
```

---

## 📦 Dependencies Summary

Main packages installed:
- ✅ TensorFlow 2.15.0 - Deep Learning
- ✅ Streamlit 1.29.0 - Web App
- ✅ Plotly 5.18.0 - Visualizations
- ✅ OpenCV 4.8.1 - Image Processing
- ✅ Pillow 10.1.0 - Image Handling
- ✅ NumPy 1.24.3 - Numerical Operations

---

## 🎓 Usage Tips

### For Best Results:

1. **Image Quality**
   - Use clear, focused images
   - Good lighting is important
   - Show the affected leaf area

2. **Image Format**
   - JPG/JPEG recommended
   - PNG also supported
   - Avoid overly compressed images

3. **Prediction Confidence**
   - >90% = Very confident
   - 75-90% = Confident
   - <75% = Review needed

---

## 🔄 Updating the App

```bash
# Pull latest changes (if using git)
git pull

# Update dependencies
pip install -r requirements.txt --upgrade

# Restart the app
streamlit run app.py
```

---

## 📱 Accessing from Other Devices

### Local Network Access:

1. Find your IP address:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address
   
   # macOS/Linux
   ifconfig
   # Look for inet address
   ```

2. Run with network access:
   ```bash
   streamlit run app.py --server.address 0.0.0.0
   ```

3. Access from other devices:
   ```
   http://YOUR_IP_ADDRESS:8501
   ```

---

## 🛑 Stopping the App

Press `Ctrl + C` in the terminal where the app is running.

---

## 📞 Need Help?

- Check the full README.md for detailed documentation
- Review the code comments in app.py
- Check GitHub Issues for known problems

---

**Ready to start? Run this command:**

```bash
streamlit run app.py
```

**Happy Disease Detection! 🍅🔬**
