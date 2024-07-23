package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	log "github.com/sirupsen/logrus"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/micro"

	"sort"
)

type Payload struct {
	Type   []string `json:"type"`
	Status int      `json:"status"`
	Data   string   `json:"data"`
}

type Response struct {
	Payload Payload `json:"payload"`
}

func main() {

	url, exists := os.LookupEnv("NATS_URL")
	if !exists {
		url = nats.DefaultURL
	} else {
		url = strings.TrimSpace(url)
	}

	if strings.TrimSpace(url) == "" {
		url = nats.DefaultURL
	}

	nc, err := nats.Connect(url)
	if err != nil {
		log.Fatal(err)
		return
	}

	srv, err := micro.AddService(nc, micro.Config{
		Name:        "minmax",
		Version:     "0.0.1",
		Description: "Returns the min/max number in a request",
	})

	log.Printf("Created service: %s (%s)\n", srv.Info().Name, srv.Info().ID)

	if err != nil {
		log.Fatal(err)
		return
	}

	root := srv.AddGroup("minmax")

	root.AddEndpoint("min", micro.HandlerFunc(handleMin))
	root.AddEndpoint("max", micro.HandlerFunc(handleMax))

	requestSlice := []int{-1, 2, 100, -2000}

	requestData, _ := json.Marshal(requestSlice)

	msg, _ := nc.Request("minmax.min", requestData, 2*time.Second)

	result := decode(msg)
	log.Printf("Requested min value, got %d\n", result.Min)

	msg, _ = nc.Request("minmax.max", requestData, 2*time.Second)
	result = decode(msg)
	// log.Printf("Requested max value, got %d\n", result.Max)

	// log.Printf("Endpoint '%s' requests: %d\n", srv.Stats().Endpoints[0].Name, srv.Stats().Endpoints[0].NumRequests)
	// log.Printf("Endpoint '%s' requests: %d\n", srv.Stats().Endpoints[1].Name, srv.Stats().Endpoints[1].NumRequests)

	// sub, err := nc.Subscribe("example-nestjs.hello.get", func(msg *nats.Msg) {

	// })
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer sub.Unsubscribe()

	// for {
	// 	// Wait for the next message
	// 	msg, err := sub.NextMsg(time.Second * 5) // Timeout after 5 seconds
	// 	if err != nil {
	// 		if err == nats.ErrTimeout {
	// 			fmt.Println("No message received within 5 seconds")
	// 			continue
	// 		} else {
	// 			log.Fatal(err)
	// 		}
	// 	}

	// 	// Handle incoming message
	// 	log.Printf("Received message: %s\n", msg.Data)
	// }

	// Use a WaitGroup to wait for a message to arrive

	// Subscribe
	response := Response{
		Payload: Payload{
			Type:   []string{"info"},
			Status: http.StatusOK,
			Data:   "asdasdsadsadsa",
		},
	}

	// Struct for unmarshalling JSON data
	type Pattern struct {
		Service  string `json:"service"`
		Endpoint string `json:"endpoint"`
		Method   string `json:"method"`
	}

	type Params struct {
		Name string `json:"name"`
	}

	type Data struct {
		Headers       map[string]interface{} `json:"headers"`
		Authorization map[string]interface{} `json:"authorization"`
		Params        Params                 `json:"params"`
		Payload       map[string]interface{} `json:"payload"`
	}

	type JSONData struct {
		Pattern Pattern `json:"pattern"`
		Data    Data    `json:"data"`
		ID      string  `json:"id"`
	}

	var jsonData JSONData
	/*
		{
		  "pattern": {
		    "service": "example-nestjs",
		    "endpoint": "hello",
		    "method": "GET"
		  },
		  "data": {
		    "headers": {},
		    "authorization": {},
		    "params": {
		      "name": "hai"
		    },
		    "payload": {}
		  },
		  "id": "5cb26e8dfd533783314c4"
		}
	*/
	if _, err := nc.Subscribe(`{"endpoint":"hello","method":"GET","service":"example-nestjs"}`, func(m *nats.Msg) {

		message, _ := json.Marshal(response)
		m.Respond(message)
		//log.Printf(string(message))
		a := json.Unmarshal(m.Data, &jsonData)
		if a != nil {
			log.Fatal(a)
		} else {
			fmt.Println("m.Subject: ", m.Subject)
			fmt.Println("m.Reply: ", m.Reply)
			fmt.Println("m.Header: ")
			for k, v := range m.Header {
				fmt.Println(k, "value is", v)
			}

			fmt.Println(jsonData.Data.Params)
		}

	}); err != nil {
		log.Fatal(err)
	}

	// Wait for a message to come in
	select {}
}

func handleMin(req micro.Request) {
	var arr []int
	_ = json.Unmarshal([]byte(req.Data()), &arr)
	sort.Ints(arr[:])

	res := ServiceResult{Min: arr[0]}
	req.RespondJSON(res)
}

func handleMax(req micro.Request) {
	var arr []int
	_ = json.Unmarshal([]byte(req.Data()), &arr)
	sort.Ints(arr[:])

	res := ServiceResult{Max: arr[len(arr)-1]}
	req.RespondJSON(res)
}

func decode(msg *nats.Msg) ServiceResult {
	var res ServiceResult
	json.Unmarshal(msg.Data, &res)
	return res
}

type ServiceResult struct {
	Min int `json:"min,omitempty"`
	Max int `json:"max,omitempty"`
}
