from flask import Flask, render_template, request
import cv2
from flask_cors import CORS
import numpy as np
import tensorflow as tf

# flask_cors is needed to enable CORS requests
app = Flask(__name__)
cors = CORS(app)

# This function is present just to see if your deployed application is reachable in case you can't
#  directly ping your main model predict function
@app.route('/ping')
def checkReachability():
    return '1'

# This is your main function where you can get predictions from your trained model for the images received by the server
@app.route('/yourendpoint', methods=['POST'])
def my_link():
    # print(request.files)
    # In this example, the server expects 2 images img1, img2 to be sent by the client and uses the model to predict the similarity
    img1 = np.fromstring(request.files['img1'].read(), np.uint8)
    img1 = cv2.imdecode(img1, cv2.IMREAD_COLOR)

    img2 = np.fromstring(request.files['img2'].read(), np.uint8)
    img2 = cv2.imdecode(img2, cv2.IMREAD_COLOR)

    print(img1.shape)
    print(img2.shape)
    
    # model = tf.keras.models.load_model('./path/to/model')
    # y = model.predict([img1/255., img2/255.])
    y = 1
    return str(float(y))

if __name__ == '__main__':
    app.run(debug=True)