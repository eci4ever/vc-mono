package api

import (
	"strings"
	"testing"
)

func TestHashVerifyPassword(t *testing.T) {
	hash, err := HashPassword("correct horse battery staple")
	if err != nil {
		t.Fatalf("hash: %v", err)
	}
	if !strings.HasPrefix(hash, "$argon2id$v=19$") {
		t.Fatalf("hash = %q, want argon2id PHC format", hash)
	}

	ok, err := VerifyPassword("correct horse battery staple", hash)
	if err != nil || !ok {
		t.Fatalf("verify correct password: ok=%v err=%v", ok, err)
	}

	ok, err = VerifyPassword("wrong password", hash)
	if err != nil || ok {
		t.Fatalf("verify wrong password: ok=%v err=%v", ok, err)
	}
}

func TestVerifyPasswordRejectsGarbage(t *testing.T) {
	for _, bad := range []string{
		"",
		"plaintext",
		"$bcrypt$salt$hash",
		"$argon2id$v=19$m=65536,t=1,p=4$!!!$!!!",
	} {
		if _, err := VerifyPassword("x", bad); err == nil {
			t.Fatalf("VerifyPassword(%q) succeeded, want error", bad)
		}
	}
}

func TestHashIsSalted(t *testing.T) {
	a, err := HashPassword("same-password")
	if err != nil {
		t.Fatalf("hash a: %v", err)
	}
	b, err := HashPassword("same-password")
	if err != nil {
		t.Fatalf("hash b: %v", err)
	}
	if a == b {
		t.Fatal("two hashes of the same password are identical — salt is missing")
	}
}
