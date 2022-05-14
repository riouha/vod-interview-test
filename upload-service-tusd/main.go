package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	tusd "github.com/tus/tusd/pkg/handler"
	"github.com/tus/tusd/pkg/s3store"
)

func main() {
	println("start main.go ...")

	handler := getHandler("/testbucket")
	http.Handle("/upload/", http.StripPrefix("/upload/", handler))

	err := http.ListenAndServe(":4000", nil)
	if err != nil {
		panic("unable to listen to port 4000")
	}
}

func getHandler(bucket string) *tusd.Handler {
	composer := getS3Composer(bucket)

	handler, err := tusd.NewHandler(tusd.Config{
		BasePath:                "/upload/",
		StoreComposer:           composer,
		RespectForwardedHeaders: true,
		NotifyCompleteUploads:   true,
		// NotifyCreatedUploads: true,
		// NotifyTerminatedUploads: false,
		// NotifyUploadProgress:    false,
		// MaxSize:400000,
		PreUploadCreateCallback: func(hook tusd.HookEvent) error {
			response := new(ApiResponse)
			bearerToken := hook.HTTPRequest.Header.Get("Authorization")
			url := "http://127.0.0.1:4001/storage/verify-upload/?size=" + fmt.Sprint(hook.Upload.Size)
			err, statuscode := apiCall("GET", url, bearerToken, nil, response)
			if err != nil || response.HasError {
				return tusd.NewHTTPError(err, statuscode)
			}
			return nil
		},
	})
	if err != nil {
		panic(fmt.Errorf("Unable to create handler: %s", err))
	}
	go func() {
		for {
			event := <-handler.CompleteUploads
			fmt.Printf("######################### Upload %s finished\n", event.Upload.ID)
			response := new(ApiResponse)
			bearerToken := event.HTTPRequest.Header.Get("Authorization")
			postBody, _ := json.Marshal(event.Upload)
			postBodyIO := bytes.NewReader(postBody)
			url := "http://127.0.0.1:4001/storage/successful-upload/" + fmt.Sprint()
			err, code := apiCall("POST", url, bearerToken, postBodyIO, response)

			println(code, err)
			if err != nil {
				println(err.Error())
			}
		}
	}()

	return handler
}

func getS3Composer(bucket string) *tusd.StoreComposer {
	s3Config := &aws.Config{
		Region:      aws.String("MINIO_REGION"),
		Endpoint:    aws.String("http://192.168.1.191:9000"),
		Credentials: credentials.NewStaticCredentials("minio", "minio123", ""),
		DisableSSL:  aws.Bool(true),
	}
	store := s3store.New(bucket, s3.New(session.Must(session.NewSession()), s3Config))
	composer := tusd.NewStoreComposer()
	store.UseIn(composer)
	return composer
}

func apiCall(method string, url string, bearerToken string, body io.Reader, target interface{}) (error, int) {
	client := &http.Client{
		Timeout: time.Second * 10,
	}

	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return err, 500
	}
	if method == "POST" || method == "PATCH" || method == "PUT" {
		req.Header.Set("Content-Type", "application/json")
	}
	req.Header.Set("Authorization", bearerToken)

	response, err := client.Do(req)
	if err != nil {
		return err, response.StatusCode
	}
	defer response.Body.Close()
	return json.NewDecoder(response.Body).Decode(target), 200
}

type ApiResponse struct {
	HasError bool   `json:"hasError"`
	Message  string `json:"message"`
	// Data     string `json:"data"`
}
