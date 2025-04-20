#!/usr/bin/env python3
from PIL import Image, ImageDraw
import math

def create_cat_icon(size=512, bg_color=(76, 175, 80), cat_color=(255, 255, 255)):
    # Create a new image with RGBA mode
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate dimensions
    padding = size * 0.1
    center = size / 2
    face_radius = (size - 2 * padding) / 2
    ear_size = face_radius * 0.7
    
    # Draw background circle
    draw.ellipse([padding, padding, size - padding, size - padding], 
                 fill=bg_color)
    
    # Draw cat face (white circle)
    inner_padding = size * 0.2
    draw.ellipse([inner_padding, inner_padding, size - inner_padding, size - inner_padding], 
                 fill=cat_color)
    
    # Draw ears
    # Left ear
    left_ear_points = [
        (center - face_radius * 0.6, center - face_radius * 0.3),  # Bottom
        (center - face_radius * 0.8, center - face_radius * 0.9),  # Top
        (center - face_radius * 0.2, center - face_radius * 0.5),  # Right
    ]
    draw.polygon(left_ear_points, fill=cat_color)
    
    # Right ear
    right_ear_points = [
        (center + face_radius * 0.6, center - face_radius * 0.3),  # Bottom
        (center + face_radius * 0.8, center - face_radius * 0.9),  # Top
        (center + face_radius * 0.2, center - face_radius * 0.5),  # Left
    ]
    draw.polygon(right_ear_points, fill=cat_color)
    
    # Draw eyes
    eye_radius = face_radius * 0.15
    eye_y = center - eye_radius * 0.5
    # Left eye
    draw.ellipse([center - face_radius * 0.4 - eye_radius, eye_y - eye_radius,
                  center - face_radius * 0.4 + eye_radius, eye_y + eye_radius],
                 fill=(0, 0, 0))
    # Right eye
    draw.ellipse([center + face_radius * 0.4 - eye_radius, eye_y - eye_radius,
                  center + face_radius * 0.4 + eye_radius, eye_y + eye_radius],
                 fill=(0, 0, 0))
    
    # Draw nose
    nose_size = face_radius * 0.12
    nose_y = center + face_radius * 0.1
    nose_points = [
        (center, nose_y - nose_size),  # Top
        (center - nose_size, nose_y + nose_size),  # Bottom left
        (center + nose_size, nose_y + nose_size),  # Bottom right
    ]
    draw.polygon(nose_points, fill=(0, 0, 0))
    
    # Draw mouth
    mouth_start_y = nose_y + nose_size * 1.5
    # Left curve
    draw.arc([center - face_radius * 0.3, mouth_start_y,
              center, mouth_start_y + face_radius * 0.2],
             0, 180, fill=(0, 0, 0), width=max(int(size * 0.01), 1))
    # Right curve
    draw.arc([center, mouth_start_y,
              center + face_radius * 0.3, mouth_start_y + face_radius * 0.2],
             0, 180, fill=(0, 0, 0), width=max(int(size * 0.01), 1))
    
    return img

if __name__ == '__main__':
    # Create the icon
    icon = create_cat_icon(512)
    
    # Save as source_icon.png
    icon.save('source_icon.png', 'PNG')
    print("Created source_icon.png")
    
    # Now run the icon generator to create all sizes
    import generate_icons
    generate_icons.generate_icons('source_icon.png')
    generate_icons.generate_splash_screens('source_icon.png') 