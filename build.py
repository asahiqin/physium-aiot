import os
from shutil import copyfile, rmtree
import json

Manifest = {}
def create_bak():
    os.mkdir("./temp_bak")
    copyfile("./src/manifest.json", "./temp_bak/manifest.json")
    copyfile("./src/common/logo.png", "./temp_bak/logo.png")
    copyfile("./src/common/logo_9.png", "./temp_bak/logo_9.png")
    
def prepare_release():
    try:
        os.mkdir("./release")
    except Exception as e:
        pass

def restore_bak():
    copyfile("./temp_bak/manifest.json", "./src/manifest.json")
    copyfile("./temp_bak/logo.png", "./src/common/logo.png")
    copyfile( "./temp_bak/logo_9.png", "./src/common/logo_9.png")
    rmtree("./temp_bak")

def get_manifest_data():
    global Manifest
    with open("./temp_bak/manifest.json", "r") as f:
        Manifest = json.load(f)

def build_9pro():
    global Manifest
    Manfiest_9Pro = Manifest.copy()
    Manfiest_9Pro["package"] = "band9p.io.github.asahiqin.physium"
    with open("./src/manifest.json", "w") as f:
        json.dump(Manfiest_9Pro, f, ensure_ascii=False, indent=4)
    build_code = os.system("npm run build")
    print("[INFO] Build exit code:", build_code)
    release_code = os.system("npm run release")
    print("[INFO] Release exit code", release_code)
    os.system("cp ./dist/*.rpk ./release/")

def build_9():
    copyfile( "./temp_bak/logo_9.png", "./src/common/logo.png")
    global Manifest
    Manfiest_9 = Manifest.copy()
    Manfiest_9["package"] = "band9.io.github.asahiqin.physium"
    with open("./src/manifest.json", "w") as f:
        json.dump(Manfiest_9, f, ensure_ascii=False, indent=4)
    build_code = os.system("npm run build")
    print("[INFO] Build exit code:", build_code)
    release_code = os.system("npm run release")
    print("[INFO] Release exit code", release_code)
    os.system("cp ./dist/*.rpk ./release/")
    

if __name__ == "__main__":
    # Prepare release environment
    prepare_release()
    
    # Create backup
    create_bak()

    # Loading manifest data
    get_manifest_data()
    
    # Build 9 pro band
    print("[INFO] Buil 9pro now")
    build_9pro()
    
    # Build 9 band
    print("[INFO] Buil 9 now")
    build_9()
    
    # Restore backup
    restore_bak()
    print("[INFO] Finished")