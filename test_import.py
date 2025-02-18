import sys
print("Python Path:")
for path in sys.path:
    print(path)

try:
    import mediaunmasked
    print("\nMediaUnmasked found!")
    print(f"Location: {mediaunmasked.__file__}")
except ImportError as e:
    print("\nFailed to import mediaunmasked:")
    print(str(e)) 