import os
import re
import json
from pathlib import Path

def extract_endpoints_from_file(file_path):
    """Extract all REST endpoints from a single Java controller file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    endpoints = []
    
    # Find RequestMapping at class level
    class_mapping_match = re.search(r'@RequestMapping\(\"([^\"]+)"\)', content)
    base_path = class_mapping_match.group(1) if class_mapping_match else ''
    
    # Pattern to match all endpoint annotations
    method_patterns = [
        (r'@GetMapping(?:\(["\']([^"\']*)["\'](?:.*?)?\)|\(\))?', 'GET'),
        (r'@PostMapping(?:\(["\']([^"\']*)["\'](?:.*?)?\)|\(\))?', 'POST'),
        (r'@PutMapping(?:\(["\']([^"\']*)["\'](?:.*?)?\)|\(\))?', 'PUT'),
        (r'@DeleteMapping(?:\(["\']([^"\']*)["\'](?:.*?)?\)|\(\))?', 'DELETE'),
        (r'@PatchMapping(?:\(["\']([^"\']*)["\'](?:.*?)?\)|\(\))?', 'PATCH'),
    ]
    
    for pattern, method in method_patterns:
        matches = re.finditer(pattern, content)
        for match in matches:
            endpoint_path = match.group(1) if match.group(1) else ''
            full_path = base_path + endpoint_path
            
            # Find the method name
            remaining_content = content[match.end():]
            method_name_match = re.search(r'public\s+\S+\s+(\w+)\s*\(', remaining_content[:200])
            method_name = method_name_match.group(1) if method_name_match else 'unknown'
            
            endpoints.append({
                'method': method,
                'path': full_path,
                'controller': Path(file_path).stem,
                'function': method_name
            })
    
    return endpoints

def scan_all_controllers(src_path):
    """Scan all controller files in the project"""
    all_endpoints = []
    
    java_path = os.path.join(src_path, 'src', 'main', 'java')
    
    for root, dirs, files in os.walk(java_path):
        for file in files:
            if file.endswith('Controller.java'):
                file_path = os.path.join(root, file)
                print(f"Scanning: {file}")
                endpoints = extract_endpoints_from_file(file_path)
                all_endpoints.extend(endpoints)
    
    return all_endpoints

if __name__ == "__main__":
    project_root = r"c:\Users\Aman\ALL PROJECTS\MAIN BACKEND\cmda-hub-backend"
    endpoints = scan_all_controllers(project_root)
    
    # Save to JSON
    output_file = os.path.join(project_root, 'extracted_endpoints.json')
    with open(output_file, 'w') as f:
        json.dump(endpoints, f, indent=2)
    
    print(f"\n✅ Extracted {len(endpoints)} endpoints")
    print(f"📁 Saved to: {output_file}")
    
    # Print summary
    methods = {}
    for ep in endpoints:
        methods[ep['method']] = methods.get(ep['method'], 0) + 1
    
    print("\n📊 Summary:")
    for method, count in sorted(methods.items()):
        print(f"  {method}: {count}")
