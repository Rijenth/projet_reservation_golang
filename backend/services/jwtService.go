package services

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

var jwtSecretKey *string

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	var jwtSecretKeyEnv = os.Getenv("JWT_SECRET_KEY")

	jwtSecretKey = &jwtSecretKeyEnv
}

func CreateToken(username *string) (string, error) {
	if jwtSecretKey == nil {
		return "", fmt.Errorf("JWT secret key is not defined")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": *username,
			"exp":      time.Now().Add(time.Hour * 1).Unix(),
		})

	tokenString, err := token.SignedString([]byte(*jwtSecretKey))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func VerifyToken(reqToken *string) error {
	token, err := jwt.Parse(*reqToken, func(token *jwt.Token) (interface{}, error) {
		return []byte(*jwtSecretKey), nil
	})

	if err != nil {
		return err
	}

	if !token.Valid {
		return fmt.Errorf("invalid token")
	}

	return nil
}
