# CASSIE - Cloud-Native Genomics Workflow Platform

**CASSIE** is a cloud-native genomics workflow platform that replaces manual pipeline construction with guided UI selections.

## About

CASSIE helps researchers upload genomic data, configure workflows, estimate resource and cost requirements, and run reproducible analyses. User-defined configurations are translated into reproducible Nextflow workflows orchestrated on scalable Kubernetes infrastructure.

## Key Features

- **Data Upload**: Import genomic files from a computer or Google Drive
- **Guided Workflow Setup**: Use the visual Pipeline Builder, community pipelines, manual tool selection, or smart suggestions
- **Reproducible Workflows**: Translate user-defined configurations into Nextflow workflows
- **Scalable Cloud Execution**: Run compute and memory intensive workloads on Kubernetes infrastructure
- **Resource & Cost Estimation**: Estimate runtime and cost from input size, selected tools, and compute resources
- **Community Pipelines and Discussions**: Share, reuse, and discuss successful workflows

## Project Structure

This is a Jekyll-based website for the CASSIE project documentation and information.

### Key Pages

- **Home**: Project overview and key features
- **Documentation**: Project deliverables and reports
- **Team**: Meet the development team

## Development

### Prerequisites

- Ruby (for Jekyll)
- Bundler

### Setup

```bash
bundle install
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000`

## Team

- **Ege Sirvan** - Project Lead
- **Eren Aslan** - Backend Developer
- **Arda Kirci** - Backend Developer
- **Emre Can Yologlu** - Backend Developer
- **Osman Baktir** - Frontend Developer

## License

MIT License
