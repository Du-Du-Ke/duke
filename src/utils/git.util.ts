import { Octokit } from '@octokit/rest';

interface CreateBranchResponse {
  ref: string;
  node_id: string;
  url: string;
  object: {
    type: string;
    sha: string;
    url: string;
  };
}

class GitClient {
  private owner: string;
  private repo: string;
  private client: Octokit;
  private defaultBranchSHA?: string;

  constructor(owner: string, repo: string, baseBranch?: string) {
    this.owner = owner;
    this.repo = repo;
    this.client = new Octokit({ auth: process.env.GITHUB_PAT });
  }

  async getDefaultBranchSHA(): Promise<string> {
    if (!this.defaultBranchSHA) {
      const { data } = await this.client.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: 'main'
      });

      this.defaultBranchSHA = data.commit.sha;
    }
    return this.defaultBranchSHA;
  }

  async createBranch(branchName: string): Promise<CreateBranchResponse> {
    const defaultBranchSHA = await this.getDefaultBranchSHA();
    const { data } = await this.client.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha: defaultBranchSHA,
    });
    return data;
  }

  async getFileContents(filePath: string) {
    const { data } = await this.client.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path: filePath,
    });

    // octokit is weird so had to type this as any. I'll find time to figure the actual
    // type here
    const content = Buffer.from((data as any).content, "base64").toString("utf-8");
    return content;
  };

  async createCommit(
    filePath: string,
    fileContent: string,
    commitMessage: string
  ) {
    const defaultBranchSHA = await this.getDefaultBranchSHA();
    const { data } = await this.client.git.createTree({
      owner: this.owner,
      repo: this.repo,
      base_tree: defaultBranchSHA,
      tree: [
        {
          path: filePath,
          mode: '100644',
          type: 'blob',
          content: fileContent,
        },
      ],
    });

    const newTreeSha = data.sha;

    const { data: commitData } = await this.client.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: commitMessage,
      tree: newTreeSha,
      parents: [defaultBranchSHA],
    });

    return commitData;
  }

  async updateBranchRef(commitSha: string, branch: string): Promise<void> {
    await this.client.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${branch}`,
      sha: commitSha,
    });

    return;
  }

  async createPR(title: string, newBranch: string): Promise<string> {
    const defaultBranchSHA = await this.getDefaultBranchSHA();
    const { data } = await this.client.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title,
      head: newBranch,
      base: 'main',
    });

    return data.html_url;
  }
}

export default GitClient;
