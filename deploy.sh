#!/bin/bash
gcloud compute instances create whoup-push \
    --machine-type=g1-small \
    --image=debian-8 \
    --scopes userinfo-email,cloud-platform \
    --metadata-from-file startup-script=gce/startup-script.sh \
    --zone us-central1-f \
    --tags http-server
