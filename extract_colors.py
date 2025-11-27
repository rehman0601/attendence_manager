from PIL import Image
import sys

def get_colors(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')
        # Resize to speed up and reduce noise
        img = img.resize((50, 50))
        colors = img.getcolors(50*50)
        
        # Sort by count (most frequent first)
        colors.sort(key=lambda x: x[0], reverse=True)
        
        hex_colors = []
        for count, rgb in colors:
            hex_code = '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])
            if hex_code not in hex_colors:
                hex_colors.append(hex_code)
        
        # We expect a few distinct bands based on the user request "palette"
        # Let's just print the top unique colors
        print("Extracted Colors:")
        for c in hex_colors[:10]:
            print(c)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        get_colors(sys.argv[1])
    else:
        print("Usage: python extract_colors.py <image_path>")
