import os

def extract_code_to_file(source_dir, output_file):
    """
    Extracts code from all files in a directory and its subdirectories
    and saves it to a single output file.

    Args:
        source_dir (str): The path to the directory containing the code files.
        output_file (str): The path to the output file.
    """

    combined_code = ""  # Initialize an empty string to store the extracted code

    for root, _, files in os.walk(source_dir):  # Walk through directory
        for file_name in files:
            file_path = os.path.join(root, file_name) # Get the full file path

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                   file_content = f.read() # Read the file content
                   combined_code += f"\n\n----- File: {file_path} -----\n\n" # Add a separator with the file path
                   combined_code += file_content # Add the content to the combined string
            except UnicodeDecodeError:
                print(f"Skipping file with encoding issue: {file_path}")
            except Exception as e:
                print(f"Error reading file: {file_path} - {e}")


    try:
        with open(output_file, 'w', encoding='utf-8') as f:
             f.write(combined_code) # Write the whole content into output file
        print(f"Successfully extracted code to: {output_file}")
    except Exception as e:
        print(f"Error writing to output file: {output_file} - {e}")


if __name__ == "__main__":
    source_directory = input("Enter the path to the source directory: ")
    output_filename = input("Enter the name of the output file: ")
    extract_code_to_file(source_directory, output_filename)