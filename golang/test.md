## Table-Driven Tests & Subtests
Table-driven tests are the idiomatic way to write tests in Go. Instead of writing separate functions for every test scenario, you define a slice of anonymous structs (the "table") containing inputs and expected outputs, then loop over them.

Combining this with subtests (t.Run) ensures that if one case fails, the others keep running, and your test output is organized.

```go
package math

import "testing"

func TestAbs(t *testing.T) {
	// 1. Define the test case structure and the "table"
	tests := []struct {
		name     string
		input    float64
		expected float64
	}{
		{"positive number", 5.0, 5.0},
		{"negative number", -3.0, 3.0},
		{"zero", 0.0, 0.0},
	}

	// 2. Loop through the table
	for _, tt := range tests {
		// 3. Use t.Run to isolate each case as a subtest
		t.Run(tt.name, func(t *testing.T) {
			got := Abs(tt.input)
			if got != tt.expected {
				t.Errorf("Abs(%f) = %f; want %f", tt.input, got, tt.expected)
			}
		})
	}
}
```

## Test Helpers
A test helper is a function that cleans up boilerplate inside your tests (like setting up data or making assertions).

Crucially, you must call t.Helper() inside it. This tells the Go test runner to ignore the helper line number when reporting failures, instead pointing directly to the line in your main test function that called the helper.

```go
func assertStringMatch(t *testing.T, got, want string) {
	t.Helper() // Marks this function as a test helper
	if got != want {
		t.Errorf("got %q, want %q", got, want)
	}
}

func TestGreeting(t *testing.T) {
	got := Greet("Alice")
	// If this fails, the error points HERE, not inside assertStringMatch
	assertStringMatch(t, got, "Hello, Alice") 
}
```

## Mock Interfaces
In Go, you don't need a heavy mocking framework because interfaces are satisfied implicitly. To mock a dependency (like a database or an external API), you simply define an interface in your code and write a lightweight structural mock inside your test file.

Production Code:
```go
type PaymentGateway interface {
	Charge(amount int) error
}

type OrderService struct {
	gateway PaymentGateway
}
```

Test Code:
```go
// 1. Define the mock struct
type MockGateway struct {
	ChargeFunc func(amount int) error
}

// 2. Implement the interface implicitly
func (m *MockGateway) Charge(amount int) error {
	return m.ChargeFunc(amount)
}

func TestCheckout(t *testing.T) {
	// 3. Instantiate the mock with custom behavior for this specific test
	mock := &MockGateway{
		ChargeFunc: func(amount int) error {
			return nil // Simulate a successful payment
		},
	}

	service := OrderService{gateway: mock}
	// ... continue test ...
}
```

## Golden Files
When testing functions that return large, complex, or multi-line outputs (like a generated JSON, HTML string, or structural reports), writing assertions in code becomes unreadable.

Instead, you save the expected output to a file (a "golden file") on disk and check against it. You can use a -update flag to automatically rewrite the file when requirements change.

```go
var update = flag.Bool("update", false, "update .golden files")

func TestGenerateReport(t *testing.T) {
	got := GenerateComplexHTML()
	goldenPath := "testdata/report.html.golden"

	if *update {
		os.WriteFile(goldenPath, []byte(got), 0644)
	}

	want, _ := os.ReadFile(goldenPath)
	if got != string(want) {
		t.Errorf("output does not match golden file")
	}
}
```

Run with `go test -update` to record new baselines.

## Fuzzing
Fuzz testing is a form of automated testing where the Go runtime continually feeds random, semi-structured inputs into your code to try and make it crash, panic, or uncover edge cases (like integer overflows or slice bounds out of range).

Fuzz functions must start with Fuzz and use *testing.F.

```go
func FuzzParseData(f *testing.F) {
	// Provide seed corpus (starting points)
	f.Add([]byte("valid-input")) 
	
	f.Fuzz(func(t *testing.T, data []byte) {
		// Go will execute this thousands of times per second with mutated 'data'
		_, _ = ParseData(data) 
		// The test passes as long as ParseData doesn't panic or crash
	})
}
```

Execute using: `go test -fuzz=FuzzParseData`

## Benchmark Comparison (benchstat)
Go's built-in benchmarking tells you how fast your code runs (`go test -bench=.`). However, if you optimize your code, how do you verify the performance gain is statistically valid and not just random computer noise?

You use Go's official tool: **benchstat**.

The Workflow:
- Run benchmarks on your old code (main branch) and save the output:
```bash
go test -bench=BenchmarkMyFunc -count=10 > old.txt
```
- Make your optimization adjustments, run the benchmark again on your new code:
```bash
go test -bench=BenchmarkMyFunc -count=10 > new.txt
```
- Compare them using benchstat:
```bash
benchstat old.txt new.txt
```

Example output:
```
name          old time/op  new time/op  delta
MyFunc-8      120ns ± 2%    84ns ± 1%   -30.00%  (p=0.000 n=10) 
```
