package com.bosonshiggs.mathoperations;

import com.google.appinventor.components.annotations.*;
import com.google.appinventor.components.common.ComponentCategory;
import com.google.appinventor.components.runtime.AndroidNonvisibleComponent;
import com.google.appinventor.components.runtime.ComponentContainer;
import com.google.appinventor.components.runtime.errors.YailRuntimeError;

@DesignerComponent(version = 1,
    description = "An extension to perform basic and advanced mathematical operations.",
    category = ComponentCategory.EXTENSION,
    nonVisible = true,
    iconName = "https://www.iconsdb.com/icons/preview/green/math-xxl.png")
@SimpleObject(external = true)
public class MathOperations extends AndroidNonvisibleComponent {
      public Constructor(ComponentContainer container) {

            super(container.$context());
      }
      @SimpleFunction(description = "A custom method")
      public double Add(String number1, String number2) {
            return (message + message);

      }
      @SimpleFunction(description = "A custom method")
      public double Subtract(String number1, String number2) {
            return (message - message);

      }
      @SimpleFunction(description = "A custom method")
      public double Multiply(String number1, String number2) {
            return (message * message);

      }
      @SimpleFunction(description = "A custom method")
      public double Divide(String number1, String number2) {
    if (message.equals(0)) {
              String message;
      message = "Error! Division by zero!";
      Error(message);

        } else {
                      return (message / message);

        }

      }
      @SimpleEvent(description = "A custom event")
      public void Error(String message) {
            EventDispatcher.dispatchEvent(this, "Dispatcher", message);

      }
}