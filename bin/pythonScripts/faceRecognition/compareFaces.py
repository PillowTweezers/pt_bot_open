import face_recognition
import sys
import cv2 as cv


def resize(image, new_width):
    original_width, original_height, _ = image.shape
    ratio = original_width / original_height
    image = cv.resize(image, (new_width, int(ratio * new_width)))
    return image

# Parse inputs.
path1 = sys.argv[1]
path2 = sys.argv[2]

img1 = face_recognition.load_image_file(path1)
img2 = face_recognition.load_image_file(path2)

# Resize images.
img1 = resize(img1, 400)
img2 = resize(img2, 400)

try:
    face1 = face_recognition.face_encodings(img1)[0]
    face2 = face_recognition.face_encodings(img2)[0]
    print(face_recognition.face_distance([face1], face2)[0])
except IndexError:
    print(-1)
    sys.exit(0)
