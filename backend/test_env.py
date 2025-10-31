#!/usr/bin/env python
import sys
import platform
import pkg_resources

def main():
    print("Python Version Information:")
    print(f"Python version: {sys.version}")
    print(f"Python version info: {sys.version_info}")
    print(f"Platform: {platform.platform()}")
    
    print("\nInstalled Packages:")
    installed_packages = sorted([f"{pkg.key}=={pkg.version}" for pkg in pkg_resources.working_set])
    for pkg in installed_packages:
        print(pkg)

if __name__ == "__main__":
    main()
