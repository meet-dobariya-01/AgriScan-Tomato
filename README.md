<div align="center">

# 🍅 AI-Powered Tomato Leaf Disease Detection
### Using EfficientNet-B0 & Transfer Learning

[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15.0-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org)
[![Keras](https://img.shields.io/badge/Keras-2.15.0-D00000?style=for-the-badge&logo=keras&logoColor=white)](https://keras.io)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.8.1-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.29.0-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[![NumPy](https://img.shields.io/badge/NumPy-1.24.3-013243?style=flat-square&logo=numpy&logoColor=white)](https://numpy.org)
[![Pandas](https://img.shields.io/badge/Pandas-2.1.4-150458?style=flat-square&logo=pandas&logoColor=white)](https://pandas.pydata.org)
[![Matplotlib](https://img.shields.io/badge/Matplotlib-3.x-11557C?style=flat-square&logo=python&logoColor=white)](https://matplotlib.org)
[![Deep Learning](https://img.shields.io/badge/Deep%20Learning-CNN-blueviolet?style=flat-square)](https://en.wikipedia.org/wiki/Deep_learning)
[![Computer Vision](https://img.shields.io/badge/Computer%20Vision-Image%20Classification-orange?style=flat-square)](https://en.wikipedia.org/wiki/Computer_vision)
[![Transfer Learning](https://img.shields.io/badge/Transfer%20Learning-EfficientNet--B0-success?style=flat-square)](https://arxiv.org/abs/1905.11946)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github&logoColor=white)](https://github.com)

</div>

---

<div align="center">

> **A production-ready deep learning system that classifies 11 tomato leaf diseases from images using EfficientNet-B0 pretrained on ImageNet, complete with Grad-CAM explainability and a Streamlit web interface.**

</div>

---

## 📑 Table of Contents

| # | Section |
|---|---------|
| 1 | [🎯 Project Overview](#-project-overview) |
| 2 | [🏗️ Project Structure](#️-project-structure) |
| 3 | [📊 Dataset & EDA](#-dataset--exploratory-data-analysis) |
| 4 | [🔧 Data Preprocessing](#-data-preprocessing) |
| 5 | [🔀 Data Augmentation](#-data-augmentation) |
| 6 | [🧠 Model Architecture](#-model-architecture) |
| 7 | [⚙️ Training Configuration](#️-training-configuration) |
| 8 | [📈 Model Evaluation](#-model-evaluation) |
| 9 | [🏆 Results](#-results) |
| 10 | [🚀 Installation & Usage](#-installation--usage) |
| 11 | [📦 Requirements](#-requirements) |
| 12 | [🔮 Future Improvements](#-future-improvements) |
| 13 | [📜 License](#-license) |
| 14 | [👨‍💻 Author](#-author) |

---

## 🎯 Project Overview

Tomato crops are highly susceptible to a wide range of leaf diseases that can decimate yields if left undetected. Traditional visual inspection is slow, inconsistent, and requires agronomic expertise. This project addresses the problem by building a **high-accuracy, automated disease detection pipeline** using state-of-the-art deep learning.

### 🔬 Key Highlights

| Property | Detail |
|----------|--------|
| **Model** | EfficientNet-B0 (ImageNet pretrained) |
| **Task** | Multi-class Image Classification |
| **Classes** | 11 disease / health categories |
| **Input Size** | 224 × 224 × 3 (RGB) |
| **Framework** | TensorFlow 2.15 / Keras |
| **Transfer Learning** | ✅ Yes |
| **Fine-Tuning** | ❌ No (frozen feature extractor) |
| **Explainability** | ✅ Grad-CAM |
| **Web App** | ✅ Streamlit |

### 🌿 Supported Disease Classes

| # | Class Label | Disease Type |
|---|-------------|--------------|
| 1 | `Bacterial_spot` | Bacterial |
| 2 | `Early_blight` | Fungal |
| 3 | `Late_blight` | Oomycete |
| 4 | `Leaf_Mold` | Fungal |
| 5 | `Septoria_leaf_spot` | Fungal |
| 6 | `Spider_mites Two-spotted_spider_mite` | Pest |
| 7 | `Target_Spot` | Fungal |
| 8 | `Tomato_Yellow_Leaf_Curl_Virus` | Viral |
| 9 | `Tomato_mosaic_virus` | Viral |
| 10 | `healthy` | Healthy |
| 11 | `powdery_mildew` | Fungal |

---

## 🏗️ Project Structure

```
Tomato_Disease_Classification/
│
├── 📓 TOMATO.ipynb                  # Full training notebook (EDA → Training → Evaluation)
├── 🌐 app.py                        # Streamlit web application
├── 📋 requirements.txt              # Python dependencies
├── 🔧 install.bat                   # One-click installation script (Windows)
├── ▶️  run_app.bat                   # One-click app launcher (Windows)
├── 📖 QUICKSTART.md                 # Quick start guide
├── 📄 README.md                     # Project documentation
│
├── 📁 model/
│   └── best_model.h5               # Saved best model checkpoint
│
├── 📁 utils/
│   ├── __init__.py
│   ├── preprocessing.py            # Image loading, resizing, normalization
│   ├── predict.py                  # Inference pipeline & TomatoDiseasePredictor class
│   ├── gradcam.py                  # Grad-CAM explainability module
│   └── disease_info.py             # Disease metadata, symptoms, treatment info
│
├── 📁 assets/                       # Static assets (logos, diagrams)
├── 📁 outputs/                      # Training plots, confusion matrix, reports
├── 📁 sample_images/                # Example leaf images for quick testing
│
└── 📁 dataset/  (external — not committed)
    ├── TRAIN/
    │   ├── Bacterial_spot/
    │   ├── Early_blight/
    │   ├── Late_blight/
    │   ├── Leaf_Mold/
    │   ├── Septoria_leaf_spot/
    │   ├── Spider_mites Two-spotted_spider_mite/
    │   ├── Target_Spot/
    │   ├── Tomato_Yellow_Leaf_Curl_Virus/
    │   ├── Tomato_mosaic_virus/
    │   ├── healthy/
    │   └── powdery_mildew/
    └── TEST/
        └── (same 11 class folders)
```

---

## 📊 Dataset & Exploratory Data Analysis

<details>
<summary><strong>📂 Dataset Overview (click to expand)</strong></summary>

The dataset is organized in a standard `class/images` folder hierarchy with separate `TRAIN` and `TEST` splits — compatible with `tf.keras.utils.image_dataset_from_directory`.

| Split | Description |
|-------|-------------|
| `TRAIN/` | Training images across 11 class folders |
| `TEST/` | Hold-out evaluation images across 11 class folders |

Each folder name is the class label. Images are sourced from the **PlantVillage** dataset, one of the most cited plant disease benchmarks in computer vision research.

</details>

<details>
<summary><strong>🔍 EDA Steps Performed (click to expand)</strong></summary>

### 1. 📁 Folder Inspection
Verified directory structure, counted files per class, and confirmed label integrity using `os.walk`.

### 2. 🖼️ Missing & Corrupted Image Detection
Each image file is opened with `PIL.Image.verify()` to detect broken headers, incomplete JPEGs, and unreadable files before training begins.

```python
from PIL import Image

def check_corrupted(path):
    try:
        img = Image.open(path)
        img.verify()
        return False
    except Exception:
        return True
```

### 3. 🔁 Duplicate Image Detection
SHA-256 hashing is applied to every image to detect exact duplicates that could inflate evaluation metrics.

```python
import hashlib

def get_hash(path):
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()
```

### 4. 📐 Image Resolution Analysis
Widths and heights are collected across the full dataset. A scatter plot of `width vs. height` reveals the natural clustering of resolutions. Most images are in the `256×256` to `3000×4000` range.

### 5. 📏 Aspect Ratio Analysis
Aspect ratio = `width / height`. A histogram reveals whether images are predominantly portrait, landscape, or square — guiding the choice of resize strategy (simple resize vs. padding).

### 6. 🌈 RGB Histogram & Pixel Distribution
Channel-wise histograms expose:
- Color shifts specific to disease types (yellowing, browning)
- Potential exposure biases in the dataset
- Confirmation that EfficientNet's `preprocess_input` is required

### 7. 📊 Class Distribution & Imbalance Analysis

```python
import matplotlib.pyplot as plt

class_counts = {cls: len(os.listdir(os.path.join(TRAIN_DIR, cls))) for cls in os.listdir(TRAIN_DIR)}
plt.bar(class_counts.keys(), class_counts.values())
```

A bar chart visualizes per-class sample counts. Class imbalance is addressed during training using class weights or augmentation-based oversampling.

### 8. 🖼️ Random Sample Visualization
A 5×5 grid of randomly sampled images per class confirms correct labeling and gives a visual impression of disease appearances.

### 9. 🦠 Disease-wise Visualization
For each of the 11 classes, 8 sample images are displayed in a grid row to highlight intra-class variation and inter-class similarity — essential context for understanding classification difficulty.

</details>

---

## 🔧 Data Preprocessing

<details>
<summary><strong>🛠️ Full Preprocessing Pipeline (click to expand)</strong></summary>

All preprocessing is handled inside `utils/preprocessing.py` and the training notebook. The pipeline ensures every image fed to EfficientNet-B0 meets the model's exact input requirements.

### Step-by-Step Pipeline

| Step | Operation | Detail |
|------|-----------|--------|
| 1 | **Image Loading** | `tf.io.read_file` + `tf.image.decode_jpeg` |
| 2 | **Image Resizing** | Bilinear resize to `224 × 224` |
| 3 | **EfficientNet Preprocessing** | `tf.keras.applications.efficientnet.preprocess_input` |
| 4 | **Data Pipeline** | `tf.data.Dataset` with map / batch / prefetch |
| 5 | **Batch Loading** | Batch size of 32 for memory-efficient training |
| 6 | **Prefetching** | `AUTOTUNE` eliminates CPU-GPU idle time |

### Code Implementation

```python
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
AUTOTUNE = tf.data.AUTOTUNE

def load_and_preprocess(image_path, label):
    # Step 1: Read raw bytes from disk
    raw = tf.io.read_file(image_path)

    # Step 2: Decode JPEG/PNG to uint8 tensor
    image = tf.image.decode_jpeg(raw, channels=3)

    # Step 3: Resize to EfficientNet-B0 input dimensions
    image = tf.image.resize(image, IMG_SIZE)

    # Step 4: Apply EfficientNet-specific normalization
    # Scales pixel values from [0, 255] → [-1, 1] range
    image = preprocess_input(image)

    return image, label

# Build tf.data pipeline
dataset = (
    tf.data.Dataset.from_tensor_slices((image_paths, labels))
    .map(load_and_preprocess, num_parallel_calls=AUTOTUNE)  # Parallel loading
    .batch(BATCH_SIZE)                                       # Memory batching
    .prefetch(AUTOTUNE)                                      # Overlap CPU/GPU work
)
```

### Why `preprocess_input` Matters
EfficientNet-B0 was pretrained on ImageNet using a specific normalization scheme. Using raw `[0, 255]` pixel values would produce activations outside the learned distribution, severely degrading transfer learning performance. `preprocess_input` rescales and shifts pixel values to match the distribution the network was originally trained on.

</details>

---

## 🔀 Data Augmentation

<details>
<summary><strong>🎲 Augmentation Strategy & Rationale (click to expand)</strong></summary>

Augmentation is applied **only to the training set** using `tf.keras.Sequential` layers. The goal is to improve generalization by exposing the model to realistic variations it may encounter in field conditions.

```python
from tensorflow.keras import layers

augmentation_pipeline = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomFlip("vertical"),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.15),
    layers.RandomContrast(0.2),
    layers.RandomTranslation(height_factor=0.1, width_factor=0.1),
    layers.RandomHeight(0.1),
    layers.RandomWidth(0.1),
    layers.GaussianNoise(0.05),
    layers.RandomBrightness(0.2),
], name="augmentation")
```

### Augmentation Rationale

| Augmentation | Factor | Why It Helps |
|---|---|---|
| **Horizontal Flip** | — | Leaves can appear from any lateral orientation; camera angle varies in the field |
| **Vertical Flip** | — | Handheld capture may produce upside-down or inverted images of leaves |
| **Random Rotation** | ±20% | Leaves are photographed at arbitrary angles; rotation invariance is critical |
| **Random Zoom** | ±15% | Simulates varying camera distances and focal lengths from different devices |
| **Random Contrast** | ±20% | Accounts for different lighting conditions — overcast vs. direct sunlight |
| **Random Translation** | ±10% H/W | Leaf may not always be centered; forces the model to learn spatial robustness |
| **Random Height/Width** | ±10% | Compensates for aspect ratio differences in real-world crop images |
| **Gaussian Noise** | σ=0.05 | Regularizes against sensor noise and low-quality camera captures |
| **Random Brightness** | ±20% | Handles exposure variation between morning, noon, and evening photography |

</details>

---

## 🧠 Model Architecture

<details>
<summary><strong>🔬 Architecture Details (click to expand)</strong></summary>

The model uses a **frozen EfficientNet-B0 feature extractor** with a custom classification head. No base layer weights are modified during training (transfer learning without fine-tuning).

### Architecture Diagram

```
Input Image (224 × 224 × 3)
         │
         ▼
┌─────────────────────────────────────┐
│         Data Augmentation           │  ← Applied only during training
│  (Flip, Rotate, Zoom, Noise, etc.)  │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│    EfficientNet-B0 Backbone         │
│    ┌─────────────────────────────┐  │
│    │  ImageNet Pretrained Weights│  │
│    │  include_top = False        │  │
│    │  All layers FROZEN          │  │
│    │  Output shape: (7, 7, 1280) │  │
│    └─────────────────────────────┘  │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     GlobalAveragePooling2D          │  ← (7,7,1280) → (1280,)
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     Dense(256, activation='relu')   │  ← Feature compression
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     Dropout(0.3)                    │  ← Regularization
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Dense(11, activation='softmax')    │  ← 11-class output
└─────────────────────────────────────┘
         │
         ▼
  Class Probabilities (11,)
```

### Layer-by-Layer Explanation

| Layer | Output Shape | Role |
|-------|-------------|------|
| Input | (None, 224, 224, 3) | RGB image batch |
| EfficientNet-B0 | (None, 7, 7, 1280) | Deep feature extraction — frozen |
| GlobalAveragePooling2D | (None, 1280) | Spatial compression, reduces overfitting vs. Flatten |
| Dense (256, ReLU) | (None, 256) | Non-linear feature transformation |
| Dropout (0.3) | (None, 256) | Randomly zeros 30% of neurons during training |
| Dense (11, Softmax) | (None, 11) | Probability distribution over 11 classes |

### Model Code

```python
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras import layers, models

# Load pretrained backbone — no classification head
base_model = EfficientNetB0(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze all backbone weights
base_model.trainable = False

# Build classification head
inputs = layers.Input(shape=(224, 224, 3))
x = augmentation_pipeline(inputs)          # Augmentation (train-time only)
x = base_model(x, training=False)          # Feature extraction
x = layers.GlobalAveragePooling2D()(x)     # Spatial pooling
x = layers.Dense(256, activation='relu')(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(11, activation='softmax')(x)

model = models.Model(inputs, outputs)
```

### Why EfficientNet-B0?

| Reason | Explanation |
|--------|-------------|
| **Accuracy vs. Efficiency** | Best-in-class accuracy with the smallest EfficientNet variant |
| **Compound Scaling** | Uniformly scales depth, width, and resolution — more principled than manual tuning |
| **ImageNet Weights** | Pre-learned low-level (edges, textures) and high-level (shapes, patterns) features transfer well to plant disease patterns |
| **Parameter Count** | ~5.3M params — fast inference suitable for edge deployment |

</details>

---

## ⚙️ Training Configuration

<details>
<summary><strong>🏋️ Training Setup & Callbacks (click to expand)</strong></summary>

### Hyperparameters

| Parameter | Value |
|-----------|-------|
| **Optimizer** | Adam |
| **Learning Rate** | 1e-3 (adaptive via ReduceLROnPlateau) |
| **Loss Function** | Sparse Categorical Crossentropy |
| **Batch Size** | 32 |
| **Epochs** | Up to 50 (early stopping applies) |
| **Metrics** | Accuracy |

### Loss Function Choice

`SparseCategoricalCrossentropy` is used because class labels are integer-encoded (not one-hot). This avoids the memory overhead of one-hot encoding for 11 classes across large batches.

### Optimizer

```python
optimizer = tf.keras.optimizers.Adam(learning_rate=1e-3)

model.compile(
    optimizer=optimizer,
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
```

### Callbacks

```python
from tensorflow.keras.callbacks import (
    EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
)

callbacks = [
    EarlyStopping(
        monitor='val_loss',
        patience=7,
        restore_best_weights=True,
        verbose=1
    ),
    ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=3,
        min_lr=1e-7,
        verbose=1
    ),
    ModelCheckpoint(
        filepath='model/best_model.h5',
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    )
]
```

### Callback Explanations

| Callback | Role |
|----------|------|
| **EarlyStopping** | Halts training when `val_loss` stops improving for 7 consecutive epochs. Prevents overfitting and saves compute time. `restore_best_weights=True` ensures the final model is the best observed checkpoint. |
| **ReduceLROnPlateau** | Halves the learning rate when `val_loss` plateaus for 3 epochs. Helps the optimizer escape local minima and converge more precisely at lower learning rates. |
| **ModelCheckpoint** | Saves the model weights to disk only when `val_accuracy` improves. Guarantees the saved `.h5` file always contains the best-performing model regardless of when training stops. |

</details>

---

## 📈 Model Evaluation

<details>
<summary><strong>📉 Evaluation Metrics Explained (click to expand)</strong></summary>

### Core Metrics

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| **Accuracy** | TP+TN / Total | Overall fraction of correctly classified samples |
| **Precision** | TP / (TP+FP) | Of all predicted positives, how many are actually positive |
| **Recall** | TP / (TP+FN) | Of all actual positives, how many were correctly detected |
| **F1 Score** | 2×(P×R)/(P+R) | Harmonic mean of precision and recall — robust to class imbalance |
| **Loss** | Cross-entropy | Measures probability distribution divergence from ground truth |

### Confusion Matrix
The confusion matrix is an 11×11 grid where each cell `(i, j)` shows the number of samples of true class `i` predicted as class `j`. The diagonal represents correct predictions. Off-diagonal cells reveal which disease pairs the model confuses most — useful for identifying visually similar diseases (e.g., Early Blight vs. Target Spot).

### Classification Report
`sklearn.metrics.classification_report` outputs per-class precision, recall, F1-score, and support — essential for evaluating performance on imbalanced classes.

### ROC Curve
One-vs-Rest ROC curves are plotted for each class, with Area Under the Curve (AUC) as an aggregate quality measure per disease. AUC > 0.95 is the target threshold.

### 🔥 Grad-CAM (Gradient-weighted Class Activation Mapping)

Grad-CAM generates **visual explanations** for CNN predictions by highlighting which spatial regions of the input image were most influential in the model's decision.

**How it works:**
1. Forward pass the image through the network
2. Compute the gradient of the predicted class score with respect to the **last convolutional layer** of EfficientNet-B0
3. Global average pool the gradients to get importance weights per channel
4. Weighted sum of feature maps → coarse heatmap
5. Upsample heatmap to input resolution and overlay on original image

```python
# utils/gradcam.py (simplified)
import tensorflow as tf
import numpy as np
import cv2

class GradCAM:
    def __init__(self, model, last_conv_layer="top_conv"):
        self.model = model
        self.grad_model = tf.keras.Model(
            inputs=model.inputs,
            outputs=[model.get_layer(last_conv_layer).output, model.output]
        )

    def generate_gradcam(self, img_array, original_img):
        with tf.GradientTape() as tape:
            conv_outputs, predictions = self.grad_model(img_array)
            pred_index = tf.argmax(predictions[0])
            class_channel = predictions[:, pred_index]

        grads = tape.gradient(class_channel, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        heatmap = conv_outputs[0] @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap).numpy()
        heatmap = np.maximum(heatmap, 0) / (heatmap.max() + 1e-8)
        return heatmap
```

**Why Grad-CAM matters:**
- Confirms the model focuses on **actual lesion regions** rather than background artifacts
- Builds trust with domain experts (agronomists)
- Helps debug misclassifications by revealing what visual cues misled the model
- Required for responsible AI deployment in safety-critical domains

</details>

---

## 🏆 Results

### 📊 Performance Summary

| Metric | Training | Validation | Test |
|--------|----------|------------|------|
| **Accuracy** | ~XX% | ~XX% | ~XX% |
| **Loss** | ~X.XX | ~X.XX | ~X.XX |
| **Macro F1-Score** | — | — | ~X.XX |

> 📝 Replace the `XX` placeholders above with actual values from your training run in `TOMATO.ipynb`.

---

### 📉 Training Curves

<table>
<tr>
<td align="center"><strong>Accuracy Curve</strong></td>
<td align="center"><strong>Loss Curve</strong></td>
</tr>
<tr>
<td><img src="outputs/accuracy_curve.png" alt="Accuracy Curve" width="400"/></td>
<td><img src="outputs/loss_curve.png" alt="Loss Curve" width="400"/></td>
</tr>
</table>

---

### 🔢 Confusion Matrix

<div align="center">
<img src="outputs/confusion_matrix.png" alt="Confusion Matrix" width="600"/>
</div>

---

### 🔥 Grad-CAM Visualization

<table>
<tr>
<td align="center"><strong>Original Image</strong></td>
<td align="center"><strong>Activation Heatmap</strong></td>
<td align="center"><strong>Overlay</strong></td>
</tr>
<tr>
<td><img src="outputs/gradcam_original.png" alt="Original" width="220"/></td>
<td><img src="outputs/gradcam_heatmap.png" alt="Heatmap" width="220"/></td>
<td><img src="outputs/gradcam_overlay.png" alt="Overlay" width="220"/></td>
</tr>
</table>

> 🔍 Grad-CAM confirms the model attends to disease-affected leaf regions rather than background noise.

---

### 🖼️ Sample Predictions

<div align="center">
<img src="outputs/sample_predictions.png" alt="Sample Predictions" width="700"/>
</div>

---

## 🚀 Installation & Usage

### Prerequisites

- Python 3.8 or higher
- CUDA-compatible GPU (optional but strongly recommended)
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/Tomato_Disease_Classification.git
cd Tomato_Disease_Classification
```

---

### 2️⃣ Create a Virtual Environment

```bash
# Using venv
python -m venv venv

# Activate — Windows
venv\Scripts\activate

# Activate — macOS/Linux
source venv/bin/activate
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

> **Windows users:** Double-click `install.bat` for a one-click setup.

---

### 4️⃣ Prepare the Dataset

Place your dataset in the following structure relative to the project root:

```
dataset/
├── TRAIN/
│   ├── Bacterial_spot/
│   ├── Early_blight/
│   └── ... (11 classes)
└── TEST/
    ├── Bacterial_spot/
    └── ... (11 classes)
```

Update the `TRAIN_DIR` and `TEST_DIR` paths inside `TOMATO.ipynb` if your dataset lives elsewhere.

---

### 5️⃣ Run Training

Open and execute the full notebook:

```bash
jupyter notebook TOMATO.ipynb
```

The best model will be saved automatically to `model/best_model.h5` via the `ModelCheckpoint` callback.

---

### 6️⃣ Launch the Web Application

```bash
streamlit run app.py
```

> **Windows users:** Double-click `run_app.bat` for instant launch.

The app opens at `http://localhost:8501`. Upload any tomato leaf image to get an instant diagnosis with Grad-CAM visualization.

---

### 7️⃣ Predict on a Custom Image (Programmatic)

```python
from utils.predict import TomatoDiseasePredictor
from utils.preprocessing import load_and_preprocess_image

# Load model
predictor = TomatoDiseasePredictor("model/best_model.h5")
predictor.load_model()

# Preprocess your image
image = load_and_preprocess_image("path/to/your/leaf.jpg")

# Get prediction
result = predictor.predict(image)
print(f"Disease: {result['predicted_class']}")
print(f"Confidence: {result['confidence_percentage']:.2f}%")
print(f"Inference Time: {result['inference_time']:.3f}s")

# Get top-3 predictions
top3 = predictor.get_top_n_predictions(image, top_n=3)
for rank, pred in enumerate(top3, 1):
    print(f"  #{rank}: {pred['disease']} — {pred['percentage']:.2f}%")
```

---

## 📦 Requirements

```text
tensorflow==2.15.0
streamlit==1.29.0
pillow==10.1.0
numpy==1.24.3
opencv-python==4.8.1.78
plotly==5.18.0
pandas==2.1.4
```

Install all dependencies:

```bash
pip install -r requirements.txt
```

<details>
<summary><strong>📋 Full Dependency Descriptions (click to expand)</strong></summary>

| Package | Version | Purpose |
|---------|---------|---------|
| `tensorflow` | 2.15.0 | Core deep learning framework — model building, training, inference |
| `streamlit` | 1.29.0 | Interactive web application UI |
| `pillow` | 10.1.0 | Image loading, saving, format conversion |
| `numpy` | 1.24.3 | Numerical operations, array manipulation |
| `opencv-python` | 4.8.1.78 | Grad-CAM heatmap generation, image overlay |
| `plotly` | 5.18.0 | Interactive confidence gauge and probability bar charts |
| `pandas` | 2.1.4 | EDA tabular analysis, classification report parsing |

</details>

---

## 🔮 Future Improvements

<details>
<summary><strong>🗺️ Roadmap (click to expand)</strong></summary>

| Priority | Improvement | Description |
|----------|-------------|-------------|
| 🔴 High | **REST API (FastAPI)** | Wrap the inference pipeline in a production-ready REST endpoint with request validation, rate limiting, and OpenAPI docs |
| 🔴 High | **Fine-Tuning** | Unfreeze the top layers of EfficientNet-B0 and train with a low learning rate (1e-5) to squeeze out additional accuracy |
| 🟠 Medium | **Docker Containerization** | Package the entire app in a Docker image for reproducible, environment-agnostic deployment |
| 🟠 Medium | **Cloud Deployment** | Deploy on AWS SageMaker / GCP Vertex AI / Azure ML for scalable inference |
| 🟠 Medium | **ONNX Export** | Convert the `.h5` model to ONNX format for cross-platform interoperability |
| 🟡 Medium | **Model Quantization** | Apply INT8 post-training quantization to reduce model size by ~4× and speed up CPU inference |
| 🟡 Medium | **TensorRT Optimization** | Compile the model with TensorRT for GPU-accelerated production inference |
| 🟢 Low | **Mobile Deployment** | Convert to TensorFlow Lite (TFLite) for on-device inference on Android/iOS |
| 🟢 Low | **Real-time Detection** | Integrate OpenCV video stream for real-time leaf disease detection via webcam |
| 🟢 Low | **EfficientNet-B3/B4** | Benchmark larger EfficientNet variants to evaluate accuracy-compute tradeoffs |
| 🟢 Low | **Ensemble Model** | Average predictions from EfficientNet + ResNet50 + DenseNet for improved robustness |
| 🟢 Low | **Multi-language Support** | Internationalize the Streamlit app for use in non-English speaking agricultural regions |

</details>

---

## 📜 License

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

## 👨‍💻 Author

<div align="center">

| | |
|---|---|
| **Name** | Your Name |
| **Role** | AI/ML Engineer |
| **Email** | your.email@example.com |
| **LinkedIn** | [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile) |
| **GitHub** | [github.com/yourusername](https://github.com/yourusername) |
| **Portfolio** | [yourportfolio.com](https://yourportfolio.com) |

</div>

---

<div align="center">

### 🌟 If this project helped you, please consider giving it a star!

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/Tomato_Disease_Classification?style=social)](https://github.com/yourusername/Tomato_Disease_Classification)

---

<sub>Built with ❤️ using TensorFlow, Keras, and EfficientNet-B0</sub>

<sub>🍅 Helping farmers detect disease before it spreads — one leaf at a time.</sub>

</div>
