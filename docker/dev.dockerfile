# Arguments 
ARG NODE_VERSION=20.9.0

# ---- Builder ---
FROM node:${NODE_VERSION} AS base
ARG NODE_VERSION
ARG DEBIAN_FRONTEND=noninteractive

LABEL node_version="$NODE_VERSION"

# Install apt packages
RUN apt-get update
#RUN apt install -yq \
#    protobuf-compiler

RUN apt-get purge -y --auto-remove
RUN rm -rf /var/lib/apt/lists/* 


USER node
WORKDIR /home/node/workspace
