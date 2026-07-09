import h5py
from pprint import pprint
path = 'backend/models/best_model.h5'
with h5py.File(path, 'r') as f:
    print('attrs:')
    pprint({k: f.attrs[k] for k in f.attrs})
    print('keys:', list(f.keys()))
    print('keras_version:', f.attrs.get('keras_version'))
    print('backend:', f.attrs.get('backend'))
    print('model_config type:', type(f.attrs.get('model_config')))
