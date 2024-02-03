package models

import (
	"time"

	"gorm.io/gorm"
)

type Model struct {
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func DeclareModels() []interface{} {
	return []interface{}{
		&User{},
		&Place{},
		&Restaurant{},
		&Command{},
		&Menu{},
		&MenuItem{},
	}
}
