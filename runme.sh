#!/bin/bash

# Install or update gcloud components
# gcloud components install || gcloud components update

# Create and configure emulator
gcloud config configurations create emulator
gcloud config configurations activate emulator
gcloud config set auth/disable_credentials true
gcloud config set project test-project
gcloud config set api_endpoint_overrides/spanner http://localhost:9020/ --quiet
gcloud config configurations list

# Pull and run the Spanner emulator
docker pull gcr.io/cloud-spanner-emulator/emulator
docker run -d -p 9010:9010 -p 9020:9020 gcr.io/cloud-spanner-emulator/emulator

# Alternatively, start the Spanner emulator using gcloud (uncomment if needed)
# gcloud emulators spanner start

# Create Spanner instance and database
gcloud spanner instances create test-instance --config=emulator --description="Test Instance" --nodes=1
gcloud spanner databases create test-db --instance=test-instance

# Set the Spanner emulator host environment variable
export SPANNER_EMULATOR_HOST=localhost:9010
# export GOOGLE_APPLICATION_CREDENTIALS="~/path/to/your/credentials.json"

# Run npm commands
# npm i
# Setup database settings inside data-source.ts file if needed
# npm start

# Testing Spanner setup
# gcloud spanner instances list
# gcloud spanner databases list --instance=test-instance
# gcloud spanner databases ddl describe test-db --instance=test-instance
# gcloud spanner databases execute-sql test-db --instance=test-instance --sql="SELECT * FROM User"
gcloud spanner databases ddl update test-db --instance=test-instance --ddl="
  CREATE SEQUENCE custom_migration_id_sequence OPTIONS (
    sequence_kind = 'bit_reversed_positive',
    skip_range_min = 1,
    skip_range_max = 4294967296                     
  );"
gcloud spanner databases ddl update test-db --instance=test-instance --ddl="
  CREATE TABLE custom_migrations (
    id INT64 DEFAULT (GET_NEXT_SEQUENCE_VALUE(SEQUENCE custom_migration_id_sequence)),
    timestamp INT64 NOT NULL,
    name STRING(MAX) NOT NULL
  ) PRIMARY KEY (id);"

# $ ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ./src/migrations/anyname -d ./src/data-source.ts
# $ ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
