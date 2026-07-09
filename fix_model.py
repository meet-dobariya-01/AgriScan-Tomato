import json
import zipfile
import shutil
import os

model_path = 'backend/models/best_model.keras'
temp_dir = 'temp_model_extract'

if os.path.exists(temp_dir):
    shutil.rmtree(temp_dir)
os.makedirs(temp_dir)

print("Extracting model...")
with zipfile.ZipFile(model_path, 'r') as zip_ref:
    zip_ref.extractall(temp_dir)

config_path = os.path.join(temp_dir, 'config.json')

with open(config_path, 'r') as f:
    config_str = f.read()

config = json.loads(config_str)

def remove_renorm_keys(obj):
    if isinstance(obj, dict):
        if obj.get('class_name') == 'BatchNormalization':
            cfg = obj.get('config', {})
            cfg.pop('renorm', None)
            cfg.pop('renorm_clipping', None)
            cfg.pop('renorm_momentum', None)
        for v in obj.values():
            remove_renorm_keys(v)
    elif isinstance(obj, list):
        for item in obj:
            remove_renorm_keys(item)

print("Fixing config...")
remove_renorm_keys(config)

with open(config_path, 'w') as f:
    json.dump(config, f)

print("Repacking model...")
fixed_model_path = 'backend/models/best_model_fixed.keras'

with zipfile.ZipFile(fixed_model_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(temp_dir):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, temp_dir)
            zipf.write(file_path, arcname)

shutil.rmtree(temp_dir)
print(f"Fixed model saved to {fixed_model_path}")

# Now replace original
shutil.move(fixed_model_path, model_path)
print("Replaced original best_model.keras")
