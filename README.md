# AgroVision

AgroVision is a web-based system for detecting tomato leaf diseases from uploaded images. The goal is to help users identify crop issues early and make faster decisions about plant health.

## Live Demo

- **Frontend**: [https://agrovision.vercel.app](https://agrovision.vercel.app)
- **Backend API**: [https://agrovision.onrender.com](https://agrovision.onrender.com)

## What the project does

- Upload an image of a tomato leaf
- Get a predicted disease class
- View the confidence score
- See the top matching disease results
- Read basic disease information

## Main features

- Image-based disease classification
- FastAPI backend for predictions
- React frontend for easy use
- Support for Grad-CAM-style visual explanation
- Simple local setup for testing and development

## Tech stack

- Backend: FastAPI, TensorFlow, OpenCV, Pillow
- Frontend: React, Vite, TypeScript
- Model: trained image classification model in `.h5` format

## Key highlights

| Property | Detail |
|---|---|
| Model | EfficientNet-B0 (ImageNet pretrained) |
| Task | Multi-class image classification |
| Classes | 11 disease / health categories |
| Input size | 224 × 224 × 3 (RGB) |
| Framework | TensorFlow 2.15 / Keras |
| Transfer learning | Yes |
| Explainability | Grad-CAM support |
| Interface | React + Vite frontend |

## Supported disease classes

| # | Class label | Type |
|---|---|---|
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

## Project structure

```text
Tomato_Disease_Classification/
├── backend/
│   ├── api/             # API routes and request handling
│   ├── app/             # Core application modules
│   ├── models/          # Saved model weights
│   ├── services/        # Inference and disease info services
│   └── requirements.txt
├── frontend/
│   ├── src/             # React application source files
│   └── package.json
├── TRAIN/               # Training dataset folders
├── TEST/                # Test dataset folders
└── README.md
```

## Setup

### 1. Backend setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Frontend setup

```bash
cd ../frontend
npm install
```

### 3. Start the backend

```bash
cd ../backend
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000.

### 4. Start the frontend

```bash
cd ../frontend
npm run dev
```

The frontend will open at http://localhost:5173.

## API endpoints

The backend exposes these endpoints after startup:

- `GET /api/v1/health` — health check
- `POST /api/v1/predict` — predict disease from an uploaded JPG or PNG image
- `POST /api/v1/gradcam` — generate Grad-CAM visualization for an uploaded image
- `GET /api/v1/disease/{name}` — get disease details by class name
- `GET /api/v1/model` — get model metadata

## Model file

Make sure the trained model is present at:

```text
backend/models/best_model.h5
```

If the model file is missing, add it before starting the backend.

## Usage tips

- Use a clear image with the leaf clearly visible
- Good lighting improves prediction quality
- The system is intended for support and inspection, not a replacement for expert advice

## Notes

- The repository currently focuses on local development and testing.
- Frontend and backend are separate, so you can update either side independently.
- The current model file is stored in `backend/models/best_model.h5`.
- If you want to add deployment support, containerization or a cloud API are good next steps.

## License

This project is for educational and local use.

