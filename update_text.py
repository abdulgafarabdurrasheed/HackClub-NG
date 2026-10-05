import json

def update_file(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    if "Clubs" in data:
        data["Clubs"]["metaTitle"] = "Hack Club Nigeria"
        data["Clubs"]["metaDescription"] = "The central hub for high school and university hackers across Nigeria!"
        data["Clubs"]["heroEyebrow"] = "Hack Club Nigeria presents"
        data["Clubs"]["heroTitle"] = "Nigeria's <accent>most interesting</accent> coding community!"
        data["Clubs"]["heroCopy"] = "A nationwide network of high school and university coding clubs. Make cool things, find people who share your interests, and get help from a community of hackers across Nigeria!"
        data["Clubs"]["startClub"] = "Register your club"
    
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

update_file('/Users/h.i.m/Desktop/nigeria-hackclub-site/messages/en.json')
update_file('/Users/h.i.m/Desktop/nigeria-hackclub-site/messages/namespaces/en/00-core.json')
