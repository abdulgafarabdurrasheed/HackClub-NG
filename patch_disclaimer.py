import json

def update_file(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    if "Clubs" in data:
        data["Clubs"]["affiliationDisclaimer"] = "Note: This platform is affiliated with Hack Club HQ, acting as a regional chapter intended specifically to keep track of, manage, and support Hack Clubs across Nigeria."
    
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

update_file('/Users/h.i.m/Desktop/nigeria-hackclub-site/messages/en.json')
update_file('/Users/h.i.m/Desktop/nigeria-hackclub-site/messages/namespaces/en/00-core.json')
