import tensorflow as tf
from backend.app.utils.predict import DTypePolicy, CompatibleInputLayer
print('tf', tf.__version__)
print('keras', tf.keras.__version__)
print('DTypePolicy class', DTypePolicy)
p = DTypePolicy()
print('instance type', type(p))
print('has compute_dtype', hasattr(p, 'compute_dtype'))
print('has variable_dtype', hasattr(p, 'variable_dtype'))
print('get_config', p.get_config())
print('compute_dtype()', p.compute_dtype())
print('register custom objects now')
from tensorflow.keras import utils as tf_utils
try:
    tf_utils.get_custom_objects()['DTypePolicy'] = DTypePolicy
    tf_utils.get_custom_objects()['InputLayer'] = CompatibleInputLayer
    print('tensorflow.keras custom_objects registered')
except Exception as e:
    print('tensorflow.keras registration failed', e)
try:
    import keras
    keras.utils.get_custom_objects()['DTypePolicy'] = DTypePolicy
    keras.utils.get_custom_objects()['InputLayer'] = CompatibleInputLayer
    print('keras custom_objects registered')
except Exception as e:
    print('keras registration failed', e)
print('Attempting model load')
try:
    model = tf.keras.models.load_model('backend/models/best_model.h5', compile=False, custom_objects={'DTypePolicy': DTypePolicy, 'InputLayer': CompatibleInputLayer})
    print('Model loaded', model)
except Exception as e:
    import traceback
    traceback.print_exc()
