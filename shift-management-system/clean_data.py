import json
import os
import argparse

# ✅ Default structures for each service (Keeps the correct format after clearing)
DEFAULT_STRUCTURES = {
    "authentication-service": {"users": []},
    "user-service": {"users": []},
    "shift-service": {"shifts": []},
    "event-service": {"events": []},
    "notification-service": {"notifications": []},
    "report-service": {"reports": []}
}

def reset_data_json(directory, service=None):
    """
    Resets the 'data.json' file for a specific service or all services.
    Keeps the original structure but removes stored data.

    Args:
        directory (str): The path to the main folder containing all services.
        service (str, optional): The name of the service to reset. If None, resets all services.
    """

    def reset_service_data(service_name):
        """Resets data.json for a given service while keeping the structure."""
        data_file_path = os.path.join(directory, service_name, "data.json")

        if service_name in DEFAULT_STRUCTURES:
            initial_data = DEFAULT_STRUCTURES[service_name]
        else:
            print(f"⚠️ Unknown service: {service_name}. Skipping.")
            return

        try:
            with open(data_file_path, "w") as f:
                json.dump(initial_data, f, indent=2)
            print(f"✅ Reset {data_file_path} (Data cleared, structure preserved)")
        except FileNotFoundError:
            print(f"❌ Error: {data_file_path} not found.")
        except Exception as e:
            print(f"❌ Error resetting {data_file_path}: {e}")

    if service:
        # Reset only the specified service
        reset_service_data(service)
    else:
        # Reset all services
        for subdir in os.listdir(directory):
            service_path = os.path.join(directory, subdir)
            if os.path.isdir(service_path) and os.path.exists(os.path.join(service_path, "data.json")):
                reset_service_data(subdir)

def main():
    """Main function to parse command-line arguments and reset data.json files."""
    parser = argparse.ArgumentParser(description="Reset data.json files while keeping the original structure.")
    parser.add_argument("directory", help="Path to the main directory containing all services.")
    parser.add_argument("-s", "--service", help="Specific service to reset (optional). If not specified, all services will be reset.")
    args = parser.parse_args()

    reset_data_json(args.directory, args.service)

if __name__ == "__main__":
    main()
