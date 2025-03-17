﻿using NUnit.Framework;
using UITest.Appium;
using UITest.Core;

namespace Microsoft.Maui.TestCases.Tests.Issues;

[Category(UITestCategories.Shape)]
public class Issue18131 : _IssuesUITest
{
	public override string Issue => "Color changes are not reflected in the Rectangle shapes";

	public Issue18131(TestDevice testDevice) : base(testDevice) { }

	protected override bool ResetAfterEachTest => true;

	[Test]
	public void CheckBackgroundColorUpdatesShapeBackgroundColor()
	{
		Exception? exception = null;

		App.WaitForElement("ToggleBackgroundColor");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "InitialShapesBackgroundandFillColors");

		App.Click("ToggleBackgroundColor");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "");

		if (exception != null)
		{
			throw exception;
		}
	}

	[Test]
	public void UncheckBackgroundColorUpdatesShapeBackgroundColor()
	{
		Exception? exception = null;

		App.WaitForElement("ToggleBackgroundColor");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "_Initial");

		App.Click("ToggleBackgroundColor");
		App.Click("ToggleBackgroundColor");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "_BackgroundColor");

		if (exception != null)
		{
			throw exception;
		}
	}

	[Test]
	public void CheckBackgroundUpdatesShapeBackground()
	{
		Exception? exception = null;

		App.WaitForElement("ToggleBackground");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "_Initial");

		App.Click("ToggleBackground");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "_Background");

		if (exception != null)
		{
			throw exception;
		}
	}

	[Test]
	public void UncheckBackgroundUpdatesShapeBackground()
	{
		Exception? exception = null;

		App.WaitForElement("ToggleBackground");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "_Initial");

		App.Click("ToggleBackground");
		App.Click("ToggleBackground");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "_Background");

		if (exception != null)
		{
			throw exception;
		}
	}

	[Test]
	public void CheckFillUpdatesShapeFill()
	{
		Exception? exception = null;

		App.WaitForElement("ToggleFill");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "_Initial");

		App.Click("ToggleFill");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "_Fill");

		if (exception != null)
		{
			throw exception;
		}
	}

	[Test]
	public void UncheckFillUpdatesShapeFill()
	{
		Exception? exception = null;

		App.WaitForElement("ToggleFill");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "_Initial");

		App.Click("ToggleFill");
		App.Click("ToggleFill");
		VerifyScreenshotOrSetException(ref exception, TestContext.CurrentContext.Test.MethodName + "_Fill");

		if (exception != null)
		{
			throw exception;
		}
	}
}
