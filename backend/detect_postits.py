import cv2
import numpy as np
import base64
import sys


base64_image = sys.stdin.read()

# Check base64-string for correct padding
missing_padding = len(base64_image) % 4
if missing_padding:
    base64_image += '=' * (4 - missing_padding)

try:

    # Decode Base64-string to numpy-array
    image_data = base64.b64decode(base64_image)
    nparr = np.frombuffer(image_data, np.uint8)

    # Convert numpy-arrayen to OpenCV-image
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Check image
    if image is None or image.size == 0:
        raise ValueError("Dekoderingen misslyckades. Bilden är tom.")

    # A4-paper dimensions in millimeter
    A4_WIDTH_MM = 210
    A4_HEIGHT_MM = 297

    # Convert image to grayscale and apply edge detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
    )
    edged = cv2.Canny(blurred, 50, 100)

    # Find Contours in the image
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw the contours on the image and save for troubleshooting
    output_image = edged.copy()
    cv2.drawContours(output_image, contours, -1, (0, 255, 0), 2)
    cv2.imwrite("konturer_output.png", output_image)

    # Find the largest rectangle (we assume this is the A4 paper)
    max_area = 0
    a4_contour = None

    for contour in contours:
        approx = cv2.approxPolyDP(contour, 0.02 * cv2.arcLength(contour, True), True)

        # Check if the outline is a rectangle (four corners) and find the largest
        if len(approx) == 4:
            area = cv2.contourArea(contour)

            if area > max_area:
                max_area = area
                a4_contour = approx


    if a4_contour is not None:
        
        x, y, width, height = cv2.boundingRect(a4_contour)
        
        mm_per_pixel_width = A4_WIDTH_MM / width
        mm_per_pixel_height = A4_HEIGHT_MM / height

        # Find Post-its
        postit_count = 0
        postit_measurements = []

        for contour in contours:
            approx = cv2.approxPolyDP(contour, 0.02 * cv2.arcLength(contour, True), True)
            
            # Check if it is a rectangular outline (Post-it note)
            if len(approx) == 4:
                x, y, postit_width, postit_height = cv2.boundingRect(contour)
                area = cv2.contourArea(contour)

                # Filter out small and large areas (Adjust this range depending on the size of the Post-it notes)
                if 2 < area < 50000: 
                    postit_count += 1

                    # Convert pixels to mm
                    postit_width_mm = postit_width * mm_per_pixel_width
                    postit_height_mm = postit_height * mm_per_pixel_height

                    postit_measurements.append({
                        "width_px": postit_width,
                        "height_px": postit_height,
                        "width_mm": postit_width_mm,
                        "height_mm": postit_height_mm,
                        "position": (x, y)
                    })

        # Print the number and measurements of each Post-it found
        print(f"Antal Post-its: {postit_count}")
        for idx, postit in enumerate(postit_measurements, start=1):
            print(f"Post-it {idx}: Bredd: {postit['width_mm']:.2f} mm, Höjd: {postit['height_mm']:.2f} mm, Position: {postit['position']}")
    else:
        print("Ingen A4-rektangel hittad.")

except Exception as e:
    print(f"Error: {e}", file=sys.stderr)