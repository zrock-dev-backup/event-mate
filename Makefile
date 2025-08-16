format:
	git add src/
	git diff --cached --name-only --diff-filter=AM src/ | xargs npx prettier --write
