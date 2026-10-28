import os
import zipfile

def create_clean_zip(source_dir, output_zip):
    exclude_dirs = {'node_modules', '.git', '.expo', '.system_generated', 'dist', 'web-build'}
    exclude_extensions = {'.log', '.tmp'}

    count = 0
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(source_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if any(file.endswith(ext) for ext in exclude_extensions):
                    continue
                # Exclude any zip file within the source dir
                if file.endswith('.zip'):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, source_dir)
                zf.write(full_path, rel_path)
                count += 1

    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    print(f"Created {output_zip} with {count} files, size: {size_mb:.2f} MB")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    parent_dir = os.path.dirname(current_dir)
    zip_name = "1923050181_1923051154_StudyPlanner.zip"
    
    out_parent = os.path.join(parent_dir, zip_name)
    out_local = os.path.join(current_dir, zip_name)
    
    create_clean_zip(current_dir, out_parent)
    import shutil
    shutil.copyfile(out_parent, out_local)
    print(f"Also saved local copy: {out_local}")
