# Node.js AWS deployment starter

This is a harmless Node.js HTTP + WebSocket demo intended to demonstrate a GitHub-to-AWS deployment pipeline.

## Endpoints

- `/` — basic status page
- `/health` — JSON health check
- `/ws` — WebSocket echo demo (messages are echoed to the same client)

This project is not a proxy, VPN, tunnel, or general-purpose traffic relay.

## Run locally

```bash
npm install
npm start
```

The server listens on port `8080` by default. Set `PORT` to override it.

## AWS/GitHub setup required before deployment

The workflow in `.github/workflows/deploy.yml` builds a Docker image, pushes it to ECR, and deploys a new task definition to an existing ECS service.

Create/configure these AWS resources first:

1. An ECR repository.
2. An ECS cluster and Fargate service with a load balancer or other suitable ingress.
3. An ECS task execution role with the standard task execution permissions.
4. An IAM role trusted by GitHub Actions OIDC, with permission to push to the ECR repository and register/update the ECS task and service.
5. A CloudWatch log group named `/ecs/nodejs-aws-starter`.

Set these GitHub Actions repository secrets:

- `AWS_REGION` — e.g. `eu-west-1`
- `AWS_ROLE_TO_ASSUME` — ARN of the IAM role trusted by GitHub OIDC
- `ECR_REPOSITORY` — ECR repository name
- `ECS_CLUSTER` — ECS cluster name
- `ECS_SERVICE` — ECS service name

Update `task-definition.json`:
- Replace `REPLACE_WITH_ECS_TASK_EXECUTION_ROLE_ARN` with the task execution role ARN.
- Replace `REPLACE_WITH_AWS_REGION` in the CloudWatch log options with your AWS region.

The workflow runs on pushes to `main`. It does not create the AWS cluster, service, load balancer, IAM roles, or DNS records automatically. Configure those resources in AWS first.

## Security notes

- Do not commit AWS access keys, passwords, tokens, or `.env` files.
- GitHub Actions uses OIDC role assumption rather than long-lived AWS access keys.
- Review IAM permissions and restrict the OIDC trust policy to this repository and branch.
