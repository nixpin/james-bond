package dsp

import (
	"bytes"
	"fmt"
	"os/exec"
	"strings"
	"sync"
)

// CLIClient implements IDSPClient by executing the jamesdsp binary.
type CLIClient struct {
	bin string     // path to jamesdsp binary
	mu  sync.Mutex // lock to prevent overlapping command execution
}

// NewCLIClient creates a CLIClient using the given binary path.
func NewCLIClient(bin string) *CLIClient {
	return &CLIClient{bin: bin}
}

// IsConnected runs jamesdsp --is-connected (exit code 1 = not connected).
func (c *CLIClient) IsConnected() error {
	return c.run("--is-connected")
}

// Status runs jamesdsp --status and returns the output.
func (c *CLIClient) Status() (string, error) {
	return c.output("--status")
}

// GetAll runs jamesdsp --get-all and parses key=value lines.
func (c *CLIClient) GetAll() (map[string]string, error) {
	out, err := c.output("--get-all")
	if err != nil {
		return nil, err
	}
	return parseKeyValues(out), nil
}

// Get runs jamesdsp --get <key>.
func (c *CLIClient) Get(key string) (string, error) {
	return c.output("--get", key)
}

// Set runs jamesdsp --set key=value.
func (c *CLIClient) Set(key, value string) error {
	return c.run("--set", fmt.Sprintf("%s=%s", key, value))
}

// ListDevices runs jamesdsp --list-devices.
func (c *CLIClient) ListDevices() ([]string, error) {
	out, err := c.output("--list-devices")
	if err != nil {
		return nil, err
	}
	return parseLines(out), nil
}

// ListKeys runs jamesdsp --list-keys.
func (c *CLIClient) ListKeys() ([]string, error) {
	out, err := c.output("--list-keys")
	if err != nil {
		return nil, err
	}
	return parseLines(out), nil
}

// run executes the command and returns only the error.
func (c *CLIClient) run(args ...string) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	cmd := exec.Command(c.bin, args...)
	var stderr bytes.Buffer
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		// Some versions of JamesDSP return exit status 1 on success for state-modifying commands.
		// If stderr is empty, we treat it as success.
		if stderr.Len() == 0 && isStateModifying(args) {
			return nil
		}
		return fmt.Errorf("%s %s: %w — %s", c.bin, strings.Join(args, " "), err, stderr.String())
	}
	return nil
}

// output executes the command and returns stdout as a string.
func (c *CLIClient) output(args ...string) (string, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	cmd := exec.Command(c.bin, args...)
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		// Same logic for output-returning state-modifying commands (if any)
		if stderr.Len() == 0 && isStateModifying(args) {
			return strings.TrimSpace(stdout.String()), nil
		}
		return "", fmt.Errorf("%s %s: %w — %s", c.bin, strings.Join(args, " "), err, stderr.String())
	}
	return strings.TrimSpace(stdout.String()), nil
}

func isStateModifying(args []string) bool {
	if len(args) == 0 {
		return false
	}
	cmd := args[0]
	return cmd == "--set" ||
		cmd == "--save-preset" ||
		cmd == "--load-preset" ||
		cmd == "--delete-preset" ||
		cmd == "--set-preset-rule" ||
		cmd == "--delete-preset-rule"
}

func parseKeyValues(s string) map[string]string {
	result := make(map[string]string)
	for _, line := range strings.Split(s, "\n") {
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			result[strings.TrimSpace(parts[0])] = strings.TrimSpace(parts[1])
		}
	}
	return result
}

func parseLines(s string) []string {
	var lines []string
	for _, l := range strings.Split(s, "\n") {
		if t := strings.TrimSpace(l); t != "" {
			lines = append(lines, t)
		}
	}
	return lines
}
