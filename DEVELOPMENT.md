# **Development Workflow**

## Development Process

We follow a simplified SCRUM-like workflow with 2-week sprints:

- Backlog Preparation: The Product Owner writes and prioritizes the backlog before each sprint.
- Sprint Planning: The team assigns issues to members at the start of each sprint.
- Mid-Sprint Meeting: Held halfway through each sprint with customers for status checks and requirements clarification.
- Sprint Review: At the end of the sprint, completed work is reviewed and a new app version is demoed.
- Retrospective: Before the sprint review, the team shares feedback in a short retrospective.
- Scheduling: Sprint planning occurs immediately after the previous sprint's review.

---

## Starting Work on an Issue

Before beginning work on your assigned issue:

1. Make sure you have latest changes from main:  
    ```bash
    git checkout main
    git pull
    ```
2. Create a new branch:  
    Use descriptive branch names, such as:
    - `feature/feature-name-here`
    - `bugfix/bug-title-here`
    ```bash
    git checkout -b feature/feature-name-here
    ```
3. Move the issue to "In progress" in the Github project board.

---

## Committing Your Changes

- Make separate commits for distinct parts of your work to keep history clear.
- Start commit messages with a verb (e.g., "Implement", "Add", "Remove", "Fix").
- Include enough context in the message to explain where and what was changed.

Example: "Remove add transaction page from bottom nav"

---

## Checks Before Pushing

1. Make sure the app builds and test your changes locally.  
    ```bash
    pnpm start
    ```

2. Make sure the linter check and tests pass.  
    Note: On Windows, you may see lots of errors and automatically applied changes from line endings depending on your git configuration, but git will ignore these changes when committing.

    ```bash
    pnpm lint
    # You can also fix lint issues automatically
    pnpm lint:fix

    pnpm test
    ```

## Creating a Pull Request

Push your changes to Github, and create a PR targeting the main branch.

Link the issue to the PR by writing the #issue-number in the description. E.g. #13.

After a couple of minutes, check that there are no problems detected by the PR checks that run automatically, and that there are no merge conflicts.

Finally, move the issue to "In review" in the Github project board, so that senior developers notice the need for PR review.


## Merging a Pull Request

After a senior developer has reviewed and accepted the pull request, all comments are addressed and all automatic checks pass,
the PR creator merges the pull request from Github.

When merging the PR, use the default "merge commit" strategy. After merging your PR, delete the source branch using the button on the closed PR's page.

If you wrote the issue number to the PR description, it will be moved to the "Done" in the Github project board automatically.


## Solving Merge Conflicts

You can choose whichever approach you want from below.

### Simple Approach (merge commit)

If a PR has merge conflicts, you can create a merge commit to solve the conflicts:

1. Make sure you are on the PR's branch (e.g. feature/something) and NOT on main branch.

2. Pull the latest changes to the main branch which are conflicting with your changes.  
    ```bash
    git fetch origin main
    ```

3. Merge the pulled changes into your current branch.  
    ```bash
    git merge origin/main
    ```

4. Solve merge conflicts (e.g. by going to Source Control in VSCode) and commit and push.

5. **Quickly test the app and run the linter again always after solving conflicts**


### Clean Approach (rebase)

If only a single person is working on the source branch, a cleaner but more difficult way to solve the conflict is to rebase instead.

1. Make sure you are on the PR's branch.

2. Pull the latest changes to the main branch.
    ```bash
    git fetch origin main
    ```

3. Start a rebase against the (updated) main branch.  
    ```bash
    git rebase origin/main
    ```

    All the commits on your branch will be reapplied.

4. Solve merge conflicts for each commit separately when encountered (e.g. by going to Source Control in VSCode) and stage the changes, and follow the instructions in the terminal to continue the rebase.

5. After rebase is completed, force push your now-rebased branch. Remember to never force-push branches that other people may have committed on!  
    ```bash
    git push --force-with-lease
    ```

6. **Quickly test the app and run the linter again always after solving conflicts**
