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
    source = "c:/CaNhan/LapTrinhMobile/StudyPlanner"
    out_path = "c:/CaNhan/LapTrinhMobile/1923051154_Project.zip"
    create_clean_zip(source, out_path)
