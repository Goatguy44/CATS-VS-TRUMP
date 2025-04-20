#!/usr/bin/env python3
from PIL import Image
import os

def generate_icons(source_image_path, output_dir='icons'):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Define icon sizes needed
    sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512]

    # Open the source image
    with Image.open(source_image_path) as img:
        # Convert to RGBA if not already
        img = img.convert('RGBA')
        
        # Generate icons for each size
        for size in sizes:
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            output_path = os.path.join(output_dir, f'icon-{size}.png')
            resized.save(output_path, 'PNG')
            print(f'Generated {output_path}')

def generate_splash_screens(source_image_path, output_dir='splash'):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Define splash screen sizes (width, height)
    sizes = [
        (2048, 2732),  # 12.9" iPad Pro
        (1668, 2224),  # 10.5" iPad Pro
        (1536, 2048),  # iPad Mini/Air
        (1125, 2436),  # iPhone X/XS
        (828, 1792),   # iPhone XR
        (1242, 2688),  # iPhone XS Max
    ]

    # Open the source image
    with Image.open(source_image_path) as img:
        img = img.convert('RGBA')
        
        # Generate splash screens for each size
        for width, height in sizes:
            # Calculate aspect ratios
            img_ratio = img.width / img.height
            target_ratio = width / height
            
            if target_ratio > img_ratio:
                # Target is wider than source
                new_width = width
                new_height = int(width / img_ratio)
            else:
                # Target is taller than source
                new_height = height
                new_width = int(height * img_ratio)
            
            # Resize image
            resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Create new image with correct dimensions and paste resized image centered
            new_img = Image.new('RGBA', (width, height), (255, 255, 255, 0))
            paste_x = (width - new_width) // 2
            paste_y = (height - new_height) // 2
            new_img.paste(resized, (paste_x, paste_y))
            
            output_path = os.path.join(output_dir, f'splash-{width}x{height}.png')
            new_img.save(output_path, 'PNG')
            print(f'Generated {output_path}')

if __name__ == '__main__':
    # Check if source image is provided
    if not os.path.exists('source_icon.png'):
        print("Please provide a source_icon.png file in the current directory")
        exit(1)
    
    generate_icons('source_icon.png')
    generate_splash_screens('source_icon.png') 