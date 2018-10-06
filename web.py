import flask
from flask import request
from werkzeug.utils import secure_filename
import os
from PIL import Image

UPLOAD_FOLDER = os.path.abspath(os.curdir)
app = flask.Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
@app.route('/album')
def album():
    return flask.render_template('album.html')

@app.route('/file', methods=['POST', 'GET'])
def upload():
    if request.method == "GET":
        return flask.render_template('file.html', msg="")
    else:
        msg = ""
        if request.files:
            file =  request.files['imgfile']
            filename = secure_filename(file.filename)
            filename = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filename)
            img = Image.open(filename)
            nf = os.path.splitext(filename)[0] + ".png"
            img.save(nf)
            os.remove(filename)
            msg = "PNG图片已保存到'{0}'".format(nf)
        else:
            msg = "请选择一个文件"
            
        return flask.render_template('file.html', msg=msg)

@app.route('/<ds>')
def play(ds):
    data = ds.split("_")
    return flask.render_template('play.html', catalog=data[1], serial=data[2])

if __name__ == '__main__':
    app.run(debug=True)
