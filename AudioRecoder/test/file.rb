# coding: utf-8
require "selenium-webdriver"

# chrome用のドライバを使う
driver = Selenium::WebDriver.for :chrome

driver.navigate.to "http://localhost:8080/audio-recorder/recorder.html"

# upload local audio file
driver.find_element(:css, "input[type=file]").send_key("/Users/junya_furudo/Downloads/output.wav")

sleep(10)

# テストを終了する（ブラウザを終了させる）
driver.quit
