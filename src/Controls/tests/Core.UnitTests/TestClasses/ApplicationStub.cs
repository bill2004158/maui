using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Microsoft.Maui.ApplicationModel;

namespace Microsoft.Maui.Controls.Core.UnitTests
{
	class ApplicationStub : IApplication
	{
		readonly List<IWindow> _windows = new List<IWindow>();

		public IElementHandler Handler { get; set; }

		public Maui.IElement Parent { get; set; }

		public IReadOnlyList<IWindow> Windows => _windows.AsReadOnly();

		public string Property { get; set; } = "Default";

		public AppTheme UserAppTheme { get; set; }

		public IWindow CreateWindow(IActivationState activationState)
		{
			throw new System.NotImplementedException();
		}

		public void OpenWindow(IWindow window)
		{
			_windows.Add(window);
		}

		public void CloseWindow(IWindow window)
		{
			_windows.Remove(window);
		}

		public void ActivateWindow(IWindow window) { }

		public void ThemeChanged() { }

		public IElementHandler GetElementHandler(IMauiContext context)
		{
			return null;
		}

		[return: DynamicallyAccessedMembers(DynamicallyAccessedMemberTypes.PublicConstructors)]
		public Type GetElementHandlerType()
		{
			return null;
		}
	}
}