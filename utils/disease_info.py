"""
Disease Information Database
Contains detailed information about tomato leaf diseases
"""

from typing import Dict, Any

DISEASE_INFO: Dict[str, Dict[str, Any]] = {
    "Bacterial_spot": {
        "name": "Bacterial Spot",
        "scientific_name": "Xanthomonas spp.",
        "description": "Bacterial spot is a destructive disease affecting tomato plants, causing significant yield loss.",
        "symptoms": [
            "Small, dark brown spots with yellow halos on leaves",
            "Circular lesions on fruits with raised centers",
            "Premature leaf drop and defoliation",
            "Reduced fruit quality and marketability"
        ],
        "causes": [
            "Xanthomonas bacteria infection",
            "Warm, humid weather conditions",
            "Water splash from irrigation or rain",
            "Contaminated seeds or transplants"
        ],
        "treatment": [
            "Apply copper-based bactericides",
            "Remove and destroy infected plant material",
            "Use disease-resistant varieties",
            "Implement crop rotation practices"
        ],
        "prevention": [
            "Use certified disease-free seeds",
            "Avoid overhead irrigation",
            "Maintain proper plant spacing for air circulation",
            "Sanitize tools and equipment regularly"
        ],
        "severity": "High"
    },
    
    "Early_blight": {
        "name": "Early Blight",
        "scientific_name": "Alternaria solani",
        "description": "Early blight is a fungal disease that affects tomato plants throughout the growing season.",
        "symptoms": [
            "Brown spots with concentric rings (target-like pattern)",
            "Yellowing of older leaves first",
            "Dark lesions on stems and fruits",
            "Progressive defoliation from bottom to top"
        ],
        "causes": [
            "Alternaria solani fungus",
            "High humidity and warm temperatures",
            "Poor air circulation",
            "Water stress and nutrient deficiency"
        ],
        "treatment": [
            "Apply fungicides (chlorothalonil, mancozeb)",
            "Prune affected leaves immediately",
            "Improve plant nutrition and watering",
            "Use mulch to prevent soil splash"
        ],
        "prevention": [
            "Plant resistant varieties",
            "Rotate crops (3-4 year cycle)",
            "Remove plant debris after harvest",
            "Water at soil level, not on foliage"
        ],
        "severity": "Medium to High"
    },
    
    "healthy": {
        "name": "Healthy Leaf",
        "scientific_name": "N/A",
        "description": "The plant shows no signs of disease and is in optimal health condition.",
        "symptoms": [
            "Vibrant green color",
            "No spots or discoloration",
            "Firm, turgid leaves",
            "Normal growth pattern"
        ],
        "causes": [
            "Proper nutrition",
            "Adequate watering",
            "Good disease management",
            "Optimal growing conditions"
        ],
        "treatment": [
            "No treatment needed",
            "Continue regular care",
            "Monitor for any changes",
            "Maintain preventive practices"
        ],
        "prevention": [
            "Continue current care practices",
            "Regular monitoring",
            "Balanced fertilization",
            "Proper irrigation management"
        ],
        "severity": "None"
    },
    
    "Late_blight": {
        "name": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "description": "Late blight is a devastating disease that can destroy entire tomato crops within days.",
        "symptoms": [
            "Large, irregular brown/gray lesions on leaves",
            "White fuzzy growth on leaf undersides",
            "Rapid wilting and death of foliage",
            "Brown, firm rot on fruits"
        ],
        "causes": [
            "Phytophthora infestans oomycete",
            "Cool, wet weather conditions",
            "High humidity (>90%)",
            "Infected plant material or wind-borne spores"
        ],
        "treatment": [
            "Apply systemic fungicides immediately",
            "Remove and destroy all infected plants",
            "Improve air circulation",
            "Reduce humidity around plants"
        ],
        "prevention": [
            "Use resistant varieties",
            "Avoid overhead watering",
            "Space plants properly",
            "Apply preventive fungicides in high-risk periods"
        ],
        "severity": "Critical"
    },
    
    "Leaf_Mold": {
        "name": "Leaf Mold",
        "scientific_name": "Passalora fulva (formerly Cladosporium fulvum)",
        "description": "Leaf mold is a fungal disease primarily affecting greenhouse-grown tomatoes.",
        "symptoms": [
            "Yellow spots on upper leaf surfaces",
            "Olive-green to brown fuzzy growth on lower leaf surfaces",
            "Leaf curling and wilting",
            "Premature leaf drop"
        ],
        "causes": [
            "Passalora fulva fungus",
            "High humidity (>85%)",
            "Poor ventilation in greenhouses",
            "Temperature between 72-77°F"
        ],
        "treatment": [
            "Apply fungicides (chlorothalonil, copper)",
            "Reduce humidity below 85%",
            "Improve greenhouse ventilation",
            "Remove infected leaves"
        ],
        "prevention": [
            "Maintain humidity below 85%",
            "Ensure adequate ventilation",
            "Use resistant varieties",
            "Avoid wetting foliage"
        ],
        "severity": "Medium"
    },
    
    "powdery_mildew": {
        "name": "Powdery Mildew",
        "scientific_name": "Oidium neolycopersici",
        "description": "Powdery mildew is a fungal disease characterized by white powdery growth on plant surfaces.",
        "symptoms": [
            "White powdery coating on leaves and stems",
            "Yellowing and curling of leaves",
            "Stunted plant growth",
            "Reduced fruit production"
        ],
        "causes": [
            "Fungal pathogen infection",
            "Moderate temperatures (60-80°F)",
            "High humidity but dry leaves",
            "Poor air circulation"
        ],
        "treatment": [
            "Apply sulfur-based fungicides",
            "Use potassium bicarbonate sprays",
            "Prune affected areas",
            "Increase air circulation"
        ],
        "prevention": [
            "Plant resistant varieties",
            "Ensure proper spacing",
            "Avoid excess nitrogen fertilization",
            "Monitor and act early"
        ],
        "severity": "Medium"
    },
    
    "Septoria_leaf_spot": {
        "name": "Septoria Leaf Spot",
        "scientific_name": "Septoria lycopersici",
        "description": "Septoria leaf spot is one of the most common tomato diseases worldwide.",
        "symptoms": [
            "Small circular spots with dark borders",
            "Gray centers with tiny black dots (pycnidia)",
            "Starting on lower leaves, moving upward",
            "Severe defoliation in advanced stages"
        ],
        "causes": [
            "Septoria lycopersici fungus",
            "Wet, humid conditions",
            "Temperatures around 68-77°F",
            "Water splash spreading spores"
        ],
        "treatment": [
            "Apply fungicides (mancozeb, chlorothalonil)",
            "Remove infected lower leaves",
            "Mulch to prevent soil splash",
            "Improve plant spacing"
        ],
        "prevention": [
            "Use crop rotation",
            "Water at soil level only",
            "Remove plant debris",
            "Apply preventive fungicides"
        ],
        "severity": "Medium to High"
    },
    
    "Spider_mites Two-spotted_spider_mite": {
        "name": "Spider Mites (Two-spotted Spider Mite)",
        "scientific_name": "Tetranychus urticae",
        "description": "Spider mites are tiny pests that suck plant sap, causing significant damage to tomatoes.",
        "symptoms": [
            "Yellow stippling on leaves",
            "Fine webbing on plant parts",
            "Bronzing or silvering of leaves",
            "Leaf drop and reduced vigor"
        ],
        "causes": [
            "Two-spotted spider mite infestation",
            "Hot, dry weather conditions",
            "Dusty environments",
            "Lack of natural predators"
        ],
        "treatment": [
            "Apply miticides or insecticidal soap",
            "Use horticultural oil sprays",
            "Introduce predatory mites",
            "Increase humidity around plants"
        ],
        "prevention": [
            "Regular monitoring of plants",
            "Maintain adequate irrigation",
            "Avoid water stress",
            "Encourage beneficial insects"
        ],
        "severity": "Medium"
    },
    
    "Target_Spot": {
        "name": "Target Spot",
        "scientific_name": "Corynespora cassiicola",
        "description": "Target spot is a fungal disease causing distinctive target-like lesions on tomato plants.",
        "symptoms": [
            "Brown spots with concentric rings",
            "Lesions on leaves, stems, and fruits",
            "Yellowing around spots",
            "Premature defoliation"
        ],
        "causes": [
            "Corynespora cassiicola fungus",
            "Warm, humid conditions",
            "Poor air circulation",
            "Extended leaf wetness"
        ],
        "treatment": [
            "Apply fungicides (azoxystrobin, chlorothalonil)",
            "Remove infected plant material",
            "Improve air circulation",
            "Reduce leaf wetness duration"
        ],
        "prevention": [
            "Use resistant varieties when available",
            "Practice crop rotation",
            "Avoid overhead irrigation",
            "Maintain plant spacing"
        ],
        "severity": "Medium to High"
    },
    
    "Tomato_mosaic_virus": {
        "name": "Tomato Mosaic Virus",
        "scientific_name": "Tomato mosaic virus (ToMV)",
        "description": "Tomato mosaic virus is a highly contagious viral disease affecting tomato plants.",
        "symptoms": [
            "Mottled light and dark green mosaic pattern on leaves",
            "Distorted, fern-like leaves",
            "Stunted plant growth",
            "Yellow streaking on fruits"
        ],
        "causes": [
            "Tomato mosaic virus (ToMV)",
            "Mechanical transmission through handling",
            "Contaminated tools and equipment",
            "Infected seeds or transplants"
        ],
        "treatment": [
            "No cure available - remove infected plants",
            "Control aphid populations (vectors)",
            "Sanitize all tools and equipment",
            "Destroy infected plants (do not compost)"
        ],
        "prevention": [
            "Use virus-free certified seeds",
            "Wash hands before handling plants",
            "Disinfect tools regularly",
            "Control insect vectors"
        ],
        "severity": "High"
    },
    
    "Tomato_Yellow_Leaf_Curl_Virus": {
        "name": "Tomato Yellow Leaf Curl Virus",
        "scientific_name": "Tomato yellow leaf curl virus (TYLCV)",
        "description": "TYLCV is a devastating viral disease transmitted by whiteflies, causing severe yield losses.",
        "symptoms": [
            "Upward curling of leaf margins",
            "Yellowing of leaf edges",
            "Reduced leaf size",
            "Severely stunted plant growth",
            "Few or no fruits produced"
        ],
        "causes": [
            "Tomato yellow leaf curl virus",
            "Whitefly (Bemisia tabaci) transmission",
            "Warm weather conditions",
            "High whitefly populations"
        ],
        "treatment": [
            "No cure - remove and destroy infected plants",
            "Control whitefly populations aggressively",
            "Use insecticides or biological control",
            "Install physical barriers (screens)"
        ],
        "prevention": [
            "Use virus-resistant varieties",
            "Control whitefly populations",
            "Use reflective mulches",
            "Remove infected plants immediately",
            "Use insect-proof screens in greenhouses"
        ],
        "severity": "Critical"
    }
}


def get_disease_info(disease_name: str) -> Dict[str, Any]:
    """
    Get disease information by name
    
    Args:
        disease_name: Name of the disease
        
    Returns:
        Dictionary containing disease information
    """
    return DISEASE_INFO.get(disease_name, {
        "name": disease_name,
        "scientific_name": "Unknown",
        "description": "Information not available",
        "symptoms": ["Information not available"],
        "causes": ["Information not available"],
        "treatment": ["Consult an agricultural expert"],
        "prevention": ["Information not available"],
        "severity": "Unknown"
    })


def get_all_diseases() -> list:
    """Get list of all disease names"""
    return list(DISEASE_INFO.keys())
